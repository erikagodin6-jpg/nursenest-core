import type { Express } from "express";
import { pool } from "./storage";
import { resolveAuthUser, requireAdmin } from "./admin-auth";
import crypto from "crypto";

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

async function requireInstructorForInstitution(req: any, res: any): Promise<{ userId: string; institutionId: string } | null> {
  const user = await resolveAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return null; }
  const institutionId = req.params.institutionId || req.body?.institutionId || req.query?.institutionId;
  if (!institutionId) { res.status(400).json({ error: "institutionId required" }); return null; }
  const seat = await pool.query(
    "SELECT id FROM institution_seats WHERE institution_id = $1 AND user_id = $2 AND role = 'instructor' AND active = true",
    [institutionId, user.id]
  );
  if (seat.rows.length === 0 && user.tier !== "admin") {
    res.status(403).json({ error: "Not an instructor for this institution" });
    return null;
  }
  return { userId: user.id, institutionId };
}

async function requireMemberOfInstitution(req: any, res: any): Promise<{ userId: string; institutionId: string; role: string } | null> {
  const user = await resolveAuthUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return null; }
  const institutionId = req.params.institutionId;
  if (!institutionId) { res.status(400).json({ error: "institutionId required" }); return null; }
  if (user.tier === "admin") return { userId: user.id, institutionId, role: "admin" };
  const seat = await pool.query(
    "SELECT role FROM institution_seats WHERE institution_id = $1 AND user_id = $2 AND active = true",
    [institutionId, user.id]
  );
  if (seat.rows.length === 0) {
    res.status(403).json({ error: "Not a member of this institution" });
    return null;
  }
  return { userId: user.id, institutionId, role: seat.rows[0].role };
}

async function verifyClassroomOwnership(classroomId: string, institutionId: string): Promise<boolean> {
  const result = await pool.query(
    "SELECT id FROM classrooms WHERE id = $1 AND institution_id = $2",
    [classroomId, institutionId]
  );
  return result.rows.length > 0;
}

export function registerInstitutionalRoutes(app: Express) {
  app.get("/api/institutions/my-institutions", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const seats = await pool.query(
        `SELECT s.role, s.active, i.* FROM institution_seats s
         JOIN institutions i ON s.institution_id = i.id
         WHERE s.user_id = $1 AND s.active = true`,
        [user.id]
      );
      res.json(seats.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/institutions/:institutionId/classrooms", async (req, res) => {
    try {
      const member = await requireMemberOfInstitution(req, res);
      if (!member) return;
      const result = await pool.query(
        `SELECT c.*, 
          (SELECT COUNT(*) FROM classroom_students cs WHERE cs.classroom_id = c.id) as student_count
         FROM classrooms c WHERE c.institution_id = $1 AND c.status = 'active' ORDER BY c.created_at DESC`,
        [member.institutionId]
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch classrooms" });
    }
  });

  app.post("/api/institutions/:institutionId/classrooms", async (req, res) => {
    try {
      const auth = await requireInstructorForInstitution(req, res);
      if (!auth) return;
      const { name, description } = req.body;
      if (!name) return res.status(400).json({ error: "Name required" });
      const result = await pool.query(
        `INSERT INTO classrooms (institution_id, name, description, instructor_id, status)
         VALUES ($1, $2, $3, $4, 'active') RETURNING *`,
        [auth.institutionId, name, description || null, auth.userId]
      );
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/institutions/:institutionId/classrooms/:classroomId", async (req, res) => {
    try {
      const auth = await requireInstructorForInstitution(req, res);
      if (!auth) return;
      const { name, description, status } = req.body;
      const result = await pool.query(
        `UPDATE classrooms SET name = COALESCE($1, name), description = COALESCE($2, description), status = COALESCE($3, status)
         WHERE id = $4 AND institution_id = $5 RETURNING *`,
        [name, description, status, req.params.classroomId, auth.institutionId]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Classroom not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/institutions/:institutionId/classrooms/:classroomId/students", async (req, res) => {
    try {
      const member = await requireMemberOfInstitution(req, res);
      if (!member) return;
      if (!(await verifyClassroomOwnership(req.params.classroomId, member.institutionId))) {
        return res.status(404).json({ error: "Classroom not found" });
      }
      const result = await pool.query(
        `SELECT cs.*, u.username, u.email FROM classroom_students cs
         LEFT JOIN users u ON cs.user_id = u.id
         WHERE cs.classroom_id = $1 ORDER BY cs.enrolled_at DESC`,
        [req.params.classroomId]
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.post("/api/institutions/:institutionId/classrooms/:classroomId/students", async (req, res) => {
    try {
      const auth = await requireInstructorForInstitution(req, res);
      if (!auth) return;
      if (!(await verifyClassroomOwnership(req.params.classroomId, auth.institutionId))) {
        return res.status(404).json({ error: "Classroom not found in this institution" });
      }
      const { userIds } = req.body;
      if (!userIds || !Array.isArray(userIds)) return res.status(400).json({ error: "userIds array required" });
      const added = [];
      for (const uid of userIds) {
        const existing = await pool.query(
          "SELECT id FROM classroom_students WHERE classroom_id = $1 AND user_id = $2",
          [req.params.classroomId, uid]
        );
        if (existing.rows.length === 0) {
          await pool.query(
            "INSERT INTO classroom_students (classroom_id, user_id) VALUES ($1, $2)",
            [req.params.classroomId, uid]
          );
          added.push(uid);
        }
      }
      res.json({ added: added.length });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to add students" });
    }
  });

  app.delete("/api/institutions/:institutionId/classrooms/:classroomId/students/:userId", async (req, res) => {
    try {
      const auth = await requireInstructorForInstitution(req, res);
      if (!auth) return;
      if (!(await verifyClassroomOwnership(req.params.classroomId, auth.institutionId))) {
        return res.status(404).json({ error: "Classroom not found in this institution" });
      }
      await pool.query(
        "DELETE FROM classroom_students WHERE classroom_id = $1 AND user_id = $2",
        [req.params.classroomId, req.params.userId]
      );
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to remove student" });
    }
  });

  app.get("/api/institutions/:institutionId/assignments", async (req, res) => {
    try {
      const member = await requireMemberOfInstitution(req, res);
      if (!member) return;
      const classroomId = req.query.classroomId;
      let query = `SELECT a.*, c.name as classroom_name,
        (SELECT COUNT(*) FROM assignment_submissions sub WHERE sub.assignment_id = a.id) as submission_count,
        (SELECT COUNT(*) FROM assignment_submissions sub WHERE sub.assignment_id = a.id AND sub.status = 'completed') as completed_count
        FROM assignments a
        LEFT JOIN classrooms c ON a.classroom_id = c.id
        WHERE c.institution_id = $1`;
      const params: any[] = [member.institutionId];
      if (classroomId) {
        query += " AND a.classroom_id = $2";
        params.push(classroomId);
      }
      query += " ORDER BY a.created_at DESC";
      const result = await pool.query(query, params);
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  });

  app.post("/api/institutions/:institutionId/assignments", async (req, res) => {
    try {
      const auth = await requireInstructorForInstitution(req, res);
      if (!auth) return;
      const { classroomId, title, description, type, resourceId, dueDate } = req.body;
      if (!classroomId || !title) return res.status(400).json({ error: "classroomId and title required" });
      if (!(await verifyClassroomOwnership(classroomId, auth.institutionId))) {
        return res.status(404).json({ error: "Classroom not found in this institution" });
      }
      const result = await pool.query(
        `INSERT INTO assignments (classroom_id, instructor_id, title, description, type, resource_id, due_date, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'active') RETURNING *`,
        [classroomId, auth.userId, title, description || null, type || "lesson", resourceId || null, dueDate || null]
      );
      const students = await pool.query(
        "SELECT user_id FROM classroom_students WHERE classroom_id = $1",
        [classroomId]
      );
      for (const s of students.rows) {
        await pool.query(
          "INSERT INTO assignment_submissions (assignment_id, student_id, status) VALUES ($1, $2, 'not_started')",
          [result.rows[0].id, s.user_id]
        );
      }
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/institutions/:institutionId/assignments/:assignmentId/submissions", async (req, res) => {
    try {
      const member = await requireMemberOfInstitution(req, res);
      if (!member) return;
      const assignCheck = await pool.query(
        `SELECT a.id FROM assignments a JOIN classrooms c ON a.classroom_id = c.id WHERE a.id = $1 AND c.institution_id = $2`,
        [req.params.assignmentId, member.institutionId]
      );
      if (assignCheck.rows.length === 0) return res.status(404).json({ error: "Assignment not found" });
      const result = await pool.query(
        `SELECT sub.*, u.username, u.email FROM assignment_submissions sub
         LEFT JOIN users u ON sub.student_id = u.id
         WHERE sub.assignment_id = $1 ORDER BY sub.completed_at DESC NULLS LAST`,
        [req.params.assignmentId]
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.post("/api/assignments/:assignmentId/submit", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      const { score, timeSpent } = req.body;
      const result = await pool.query(
        `UPDATE assignment_submissions SET status = 'completed', score = $1, time_spent = $2, submitted_at = NOW(), completed_at = NOW()
         WHERE assignment_id = $3 AND student_id = $4 RETURNING *`,
        [score || null, timeSpent || null, req.params.assignmentId, user.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/institutions/:institutionId/student-progress", async (req, res) => {
    try {
      const auth = await requireInstructorForInstitution(req, res);
      if (!auth) return;
      const students = await pool.query(
        `SELECT s.user_id, u.username, u.email,
          (SELECT COUNT(*) FROM test_results tr WHERE tr.user_id = s.user_id) as total_tests,
          (SELECT COALESCE(AVG(tr.score * 100.0 / NULLIF(tr.total_questions, 0)), 0) FROM test_results tr WHERE tr.user_id = s.user_id) as avg_accuracy,
          (SELECT COUNT(*) FROM user_progress up WHERE up.user_id = s.user_id AND up.completed = 'true') as lessons_completed,
          (SELECT COALESCE(SUM(ss.time_seconds), 0) FROM study_sessions ss WHERE ss.user_id = s.user_id) as total_study_time,
          (SELECT COUNT(*) FROM assignment_submissions asub
           JOIN assignments a ON asub.assignment_id = a.id
           JOIN classrooms c ON a.classroom_id = c.id
           WHERE asub.student_id = s.user_id AND c.institution_id = $1 AND asub.status = 'completed') as assignments_completed,
          (SELECT COUNT(*) FROM assignment_submissions asub
           JOIN assignments a ON asub.assignment_id = a.id
           JOIN classrooms c ON a.classroom_id = c.id
           WHERE asub.student_id = s.user_id AND c.institution_id = $1) as assignments_total
        FROM institution_seats s
        LEFT JOIN users u ON s.user_id = u.id
        WHERE s.institution_id = $1 AND s.role = 'student' AND s.active = true
        ORDER BY u.username`,
        [req.params.institutionId]
      );
      res.json(students.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/institutions/:institutionId/student-progress/:studentId", async (req, res) => {
    try {
      const auth = await requireInstructorForInstitution(req, res);
      if (!auth) return;
      const student = await pool.query(
        "SELECT u.id, u.username, u.email FROM users u WHERE u.id = $1",
        [req.params.studentId]
      );
      if (student.rows.length === 0) return res.status(404).json({ error: "Student not found" });

      const [tests, progress, exams, sessions] = await Promise.all([
        pool.query(
          "SELECT * FROM test_results WHERE user_id = $1 ORDER BY completed_at DESC LIMIT 50",
          [req.params.studentId]
        ),
        pool.query(
          "SELECT * FROM user_progress WHERE user_id = $1",
          [req.params.studentId]
        ),
        pool.query(
          "SELECT id, user_id, status, exam_type, blueprint_code, score, started_at, completed_at, report, time_spent FROM mock_exam_attempts WHERE user_id = $1 ORDER BY started_at DESC LIMIT 20",
          [req.params.studentId]
        ),
        pool.query(
          "SELECT id, user_id, deck_id, mode, total_cards, correct_count, incorrect_count, time_seconds, missed_card_ids, started_at, ended_at FROM study_sessions WHERE user_id = $1 ORDER BY started_at DESC LIMIT 30",
          [req.params.studentId]
        ),
      ]);

      const topicBreakdown: Record<string, { correct: number; total: number }> = {};
      for (const tr of tests.rows) {
        const topic = tr.lesson_id || "general";
        if (!topicBreakdown[topic]) topicBreakdown[topic] = { correct: 0, total: 0 };
        topicBreakdown[topic].correct += tr.score || 0;
        topicBreakdown[topic].total += tr.total_questions || 0;
      }

      const weakAreas = Object.entries(topicBreakdown)
        .map(([topic, data]) => ({ topic, accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0, total: data.total }))
        .filter(a => a.total >= 3)
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 10);

      res.json({
        student: snakeToCamel(student.rows[0]),
        recentTests: tests.rows.map(snakeToCamel),
        progress: progress.rows.map(snakeToCamel),
        recentExams: exams.rows.map(snakeToCamel),
        recentSessions: sessions.rows.map(snakeToCamel),
        weakAreas,
        topicBreakdown: Object.entries(topicBreakdown).map(([topic, data]) => ({
          topic,
          correct: data.correct,
          total: data.total,
          accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        })),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/institutions/:institutionId/analytics", async (req, res) => {
    try {
      const auth = await requireInstructorForInstitution(req, res);
      if (!auth) return;
      const instId = auth.institutionId;
      const [seatCount, studentScores, topicDifficulty, examReadiness] = await Promise.all([
        pool.query(
          "SELECT COUNT(*) as total, SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as students, SUM(CASE WHEN role = 'instructor' THEN 1 ELSE 0 END) as instructors FROM institution_seats WHERE institution_id = $1 AND active = true",
          [instId]
        ),
        pool.query(
          `SELECT COALESCE(AVG(tr.score * 100.0 / NULLIF(tr.total_questions, 0)), 0) as avg_score,
            COUNT(DISTINCT tr.user_id) as students_tested,
            COUNT(*) as total_tests
           FROM test_results tr
           JOIN institution_seats s ON tr.user_id = s.user_id
           WHERE s.institution_id = $1 AND s.active = true AND s.role = 'student'`,
          [instId]
        ),
        pool.query(
          `SELECT tr.lesson_id as topic,
            COUNT(*) as attempts,
            COALESCE(AVG(tr.score * 100.0 / NULLIF(tr.total_questions, 0)), 0) as avg_score
           FROM test_results tr
           JOIN institution_seats s ON tr.user_id = s.user_id
           WHERE s.institution_id = $1 AND s.active = true AND s.role = 'student'
           GROUP BY tr.lesson_id
           ORDER BY avg_score ASC
           LIMIT 20`,
          [instId]
        ),
        pool.query(
          `SELECT m.user_id, u.username, m.score, m.total_questions,
            CASE WHEN m.score IS NOT NULL AND m.total_questions > 0
              THEN ROUND(m.score * 100.0 / m.total_questions)
              ELSE 0 END as pct
           FROM mock_exam_attempts m
           JOIN institution_seats s ON m.user_id = s.user_id
           LEFT JOIN users u ON m.user_id = u.id
           WHERE s.institution_id = $1 AND s.active = true AND m.status = 'completed'
           ORDER BY m.completed_at DESC LIMIT 50`,
          [instId]
        ),
      ]);

      const classroomStats = await pool.query(
        `SELECT c.id, c.name,
          (SELECT COUNT(*) FROM classroom_students cs WHERE cs.classroom_id = c.id) as student_count,
          (SELECT COUNT(*) FROM assignments a WHERE a.classroom_id = c.id) as assignment_count
         FROM classrooms c WHERE c.institution_id = $1 AND c.status = 'active'`,
        [instId]
      );

      const assignmentCompletion = await pool.query(
        `SELECT a.id, a.title,
          COUNT(sub.id) as total_submissions,
          SUM(CASE WHEN sub.status = 'completed' THEN 1 ELSE 0 END) as completed,
          COALESCE(AVG(sub.score), 0) as avg_score
         FROM assignments a
         JOIN classrooms c ON a.classroom_id = c.id
         LEFT JOIN assignment_submissions sub ON sub.assignment_id = a.id
         WHERE c.institution_id = $1
         GROUP BY a.id, a.title
         ORDER BY a.created_at DESC LIMIT 20`,
        [instId]
      );

      res.json({
        seats: snakeToCamel(seatCount.rows[0]),
        performance: snakeToCamel(studentScores.rows[0]),
        topicDifficulty: topicDifficulty.rows.map(snakeToCamel),
        examReadiness: examReadiness.rows.map(snakeToCamel),
        classroomStats: classroomStats.rows.map(snakeToCamel),
        assignmentCompletion: assignmentCompletion.rows.map(snakeToCamel),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/institutions/:institutionId/benchmarking", async (req, res) => {
    try {
      const auth = await requireInstructorForInstitution(req, res);
      if (!auth) return;
      const instId = auth.institutionId;
      const [instAvg, platformAvg] = await Promise.all([
        pool.query(
          `SELECT COALESCE(AVG(tr.score * 100.0 / NULLIF(tr.total_questions, 0)), 0) as avg_score,
            COUNT(DISTINCT tr.user_id) as students_count,
            COUNT(*) as test_count
           FROM test_results tr
           JOIN institution_seats s ON tr.user_id = s.user_id
           WHERE s.institution_id = $1 AND s.active = true AND s.role = 'student'`,
          [instId]
        ),
        pool.query(
          `SELECT COALESCE(AVG(tr.score * 100.0 / NULLIF(tr.total_questions, 0)), 0) as avg_score,
            COUNT(DISTINCT tr.user_id) as students_count,
            COUNT(*) as test_count
           FROM test_results tr`
        ),
      ]);

      const [instExam, platformExam] = await Promise.all([
        pool.query(
          `SELECT COALESCE(AVG(CASE WHEN m.score IS NOT NULL AND m.total_questions > 0
              THEN m.score * 100.0 / m.total_questions ELSE NULL END), 0) as avg_exam_score,
            COUNT(*) as exam_count
           FROM mock_exam_attempts m
           JOIN institution_seats s ON m.user_id = s.user_id
           WHERE s.institution_id = $1 AND s.active = true AND m.status = 'completed'`,
          [instId]
        ),
        pool.query(
          `SELECT COALESCE(AVG(CASE WHEN m.score IS NOT NULL AND m.total_questions > 0
              THEN m.score * 100.0 / m.total_questions ELSE NULL END), 0) as avg_exam_score,
            COUNT(*) as exam_count
           FROM mock_exam_attempts m WHERE m.status = 'completed'`
        ),
      ]);

      const [instTopics, platformTopics] = await Promise.all([
        pool.query(
          `SELECT tr.lesson_id as topic,
            COALESCE(AVG(tr.score * 100.0 / NULLIF(tr.total_questions, 0)), 0) as avg_score
           FROM test_results tr
           JOIN institution_seats s ON tr.user_id = s.user_id
           WHERE s.institution_id = $1 AND s.active = true
           GROUP BY tr.lesson_id`,
          [instId]
        ),
        pool.query(
          `SELECT tr.lesson_id as topic,
            COALESCE(AVG(tr.score * 100.0 / NULLIF(tr.total_questions, 0)), 0) as avg_score
           FROM test_results tr
           GROUP BY tr.lesson_id`
        ),
      ]);

      const platformTopicMap: Record<string, number> = {};
      for (const row of platformTopics.rows) {
        platformTopicMap[row.topic] = Math.round(Number(row.avg_score));
      }
      const topicComparison = instTopics.rows.map((row: any) => ({
        topic: row.topic,
        institutionAvg: Math.round(Number(row.avg_score)),
        platformAvg: platformTopicMap[row.topic] || 0,
      }));

      res.json({
        institution: {
          avgScore: Math.round(Number(instAvg.rows[0]?.avg_score || 0)),
          studentsCount: Number(instAvg.rows[0]?.students_count || 0),
          testCount: Number(instAvg.rows[0]?.test_count || 0),
          avgExamScore: Math.round(Number(instExam.rows[0]?.avg_exam_score || 0)),
          examCount: Number(instExam.rows[0]?.exam_count || 0),
        },
        platform: {
          avgScore: Math.round(Number(platformAvg.rows[0]?.avg_score || 0)),
          studentsCount: Number(platformAvg.rows[0]?.students_count || 0),
          testCount: Number(platformAvg.rows[0]?.test_count || 0),
          avgExamScore: Math.round(Number(platformExam.rows[0]?.avg_exam_score || 0)),
          examCount: Number(platformExam.rows[0]?.exam_count || 0),
        },
        topicComparison,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/institutions/:institutionId/invite-email", async (req, res) => {
    try {
      const auth = await requireInstructorForInstitution(req, res);
      if (!auth) return;
      const { emails } = req.body;
      if (!emails || !Array.isArray(emails)) return res.status(400).json({ error: "emails array required" });
      const code = crypto.randomBytes(4).toString("hex").toUpperCase();
      await pool.query(
        `INSERT INTO institution_invite_codes (institution_id, code, seat_limit, expires_at)
         VALUES ($1, $2, $3, NULL)`,
        [auth.institutionId, code, emails.length]
      );
      for (const email of emails) {
        await pool.query(
          `INSERT INTO institution_roster_allowlist (institution_id, email, status, added_by_user_id)
           VALUES ($1, $2, 'active', $3) ON CONFLICT DO NOTHING`,
          [auth.institutionId, email.toLowerCase(), auth.userId]
        );
      }
      res.json({ code, emailCount: emails.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/institutions/:institutionId/bulk-csv", async (req, res) => {
    try {
      const auth = await requireInstructorForInstitution(req, res);
      if (!auth) return;
      const { csvData } = req.body;
      if (!csvData) return res.status(400).json({ error: "csvData required" });
      const lines = csvData.split("\n").map((l: string) => l.trim()).filter((l: string) => l && !l.startsWith("email"));
      const emails: string[] = [];
      for (const line of lines) {
        const email = line.split(",")[0].trim().toLowerCase();
        if (email && email.includes("@")) {
          emails.push(email);
        }
      }
      if (emails.length === 0) return res.status(400).json({ error: "No valid emails found in CSV" });
      const code = crypto.randomBytes(4).toString("hex").toUpperCase();
      await pool.query(
        `INSERT INTO institution_invite_codes (institution_id, code, seat_limit, expires_at)
         VALUES ($1, $2, $3, NULL)`,
        [auth.institutionId, code, emails.length]
      );
      let added = 0;
      for (const email of emails) {
        const result = await pool.query(
          `INSERT INTO institution_roster_allowlist (institution_id, email, status, added_by_user_id)
           VALUES ($1, $2, 'active', $3) ON CONFLICT DO NOTHING`,
          [auth.institutionId, email, auth.userId]
        );
        if (result.rowCount && result.rowCount > 0) added++;
      }
      res.json({ code, totalEmails: emails.length, newlyAdded: added });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/institutions/:institutionId/certificates", async (req, res) => {
    try {
      const auth = await requireInstructorForInstitution(req, res);
      if (!auth) return;
      const { studentId, classroomId, studentName, courseName } = req.body;
      if (!studentId || !studentName || !courseName) {
        return res.status(400).json({ error: "studentId, studentName, courseName required" });
      }
      const inst = await pool.query("SELECT name FROM institutions WHERE id = $1", [auth.institutionId]);
      if (inst.rows.length === 0) return res.status(404).json({ error: "Institution not found" });
      const certCode = `CERT-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
      const result = await pool.query(
        `INSERT INTO certificates (student_id, institution_id, classroom_id, student_name, course_name, institution_name, completion_date, certificate_code)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7) RETURNING *`,
        [studentId, auth.institutionId, classroomId || null, studentName, courseName, inst.rows[0].name, certCode]
      );
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/institutions/:institutionId/certificates", async (req, res) => {
    try {
      const member = await requireMemberOfInstitution(req, res);
      if (!member) return;
      const result = await pool.query(
        "SELECT * FROM certificates WHERE institution_id = $1 ORDER BY issued_at DESC",
        [member.institutionId]
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch certificates" });
    }
  });

  app.get("/api/certificates/verify/:code", async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM certificates WHERE certificate_code = $1",
        [req.params.code]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Certificate not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/institutions/pricing-tiers", async (_req, res) => {
    res.json({
      tiers: [
        {
          id: "small",
          name: "Small Program",
          seats: 50,
          pricePerSeat: 8,
          monthlyTotal: 400,
          features: ["Up to 50 student seats", "Instructor dashboard", "Student progress tracking", "Assignment management", "Enrollment codes"],
        },
        {
          id: "medium",
          name: "Medium Program",
          seats: 100,
          pricePerSeat: 6,
          monthlyTotal: 600,
          features: ["Up to 100 student seats", "Everything in Small", "Institution analytics", "Program benchmarking", "CSV bulk enrollment", "Certificate generation"],
        },
        {
          id: "large",
          name: "Large Program",
          seats: 250,
          pricePerSeat: 4,
          monthlyTotal: 1000,
          features: ["250+ student seats", "Everything in Medium", "Priority support", "Custom reporting", "API access", "Dedicated account manager"],
        },
      ],
    });
  });

  app.post("/api/admin/institutions/:institutionId/set-instructor", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: "userId required" });
      const existing = await pool.query(
        "SELECT id FROM institution_seats WHERE institution_id = $1 AND user_id = $2",
        [req.params.institutionId, userId]
      );
      if (existing.rows.length > 0) {
        await pool.query(
          "UPDATE institution_seats SET role = 'instructor', active = true WHERE institution_id = $1 AND user_id = $2",
          [req.params.institutionId, userId]
        );
      } else {
        await pool.query(
          "INSERT INTO institution_seats (institution_id, user_id, role, active) VALUES ($1, $2, 'instructor', true)",
          [req.params.institutionId, userId]
        );
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}
