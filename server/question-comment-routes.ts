import type { Express } from "express";
import { pool } from "./storage";
import { resolveAuthUser, requireAdmin } from "./admin-auth";
import rateLimit from "express-rate-limit";

const FLAG_THRESHOLD = 3;

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

export function registerQuestionCommentRoutes(app: Express) {
  app.get("/api/question-comments/:questionId", async (req, res) => {
    try {
      const { questionId } = req.params;
      const sort = req.query.sort === "newest" ? "newest" : "helpful";
      const user = await resolveAuthUser(req);

      const orderClause = sort === "newest"
        ? "ORDER BY qc.created_at DESC"
        : "ORDER BY qc.thumbs_up_count DESC, qc.created_at DESC";

      const result = await pool.query(
        `SELECT qc.*, u.username
         FROM question_comments qc
         LEFT JOIN users u ON u.id = qc.user_id
         WHERE qc.question_id = $1 AND qc.is_flagged = false
         ${orderClause}
         LIMIT 100`,
        [questionId]
      );

      let userVotes: Record<string, string> = {};
      if (user && result.rows.length > 0) {
        const votesResult = await pool.query(
          `SELECT comment_id, vote_type FROM question_comment_votes
           WHERE user_id = $1 AND comment_id = ANY($2)`,
          [user.id, result.rows.map((r: any) => r.id)]
        );
        for (const v of votesResult.rows) {
          userVotes[v.comment_id] = v.vote_type;
        }
      }

      const comments = result.rows.map((r: any) => ({
        ...snakeToCamel(r),
        userVote: userVotes[r.id] || null,
      }));

      res.json(comments);
    } catch (e: any) {
      console.error("Error fetching comments:", e);
      res.status(500).json({ error: "Failed to load comments" });
    }
  });

  app.get("/api/question-comments/count/:questionId", async (req, res) => {
    try {
      const { questionId } = req.params;
      const result = await pool.query(
        `SELECT COUNT(*)::int as count FROM question_comments WHERE question_id = $1 AND is_flagged = false`,
        [questionId]
      );
      res.json({ count: result.rows[0]?.count || 0 });
    } catch (e: any) {
      console.error("Error counting comments:", e);
      res.status(500).json({ error: "Failed to count comments" });
    }
  });

  const commentPostLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    keyGenerator: (req: any) => {
      return (req as any).__rateLimitUser || "anonymous";
    },
    message: { error: "You can post up to 5 comments per hour. Please try again later." },
    validate: false,
  });

  app.post("/api/question-comments", async (req, res, next) => {
    const user = await resolveAuthUser(req);
    if (!user) return res.status(401).json({ error: "Authentication required" });
    (req as any).__rateLimitUser = user.id;
    next();
  }, commentPostLimiter, async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { questionId, content } = req.body;
      if (!questionId || typeof questionId !== "string" || questionId.length > 200) {
        return res.status(400).json({ error: "Valid questionId is required" });
      }
      if (!content || typeof content !== "string" || content.trim().length === 0) {
        return res.status(400).json({ error: "Comment content is required" });
      }
      if (content.trim().length > 1000) {
        return res.status(400).json({ error: "Comment too long (max 1000 characters)" });
      }

      const result = await pool.query(
        `INSERT INTO question_comments (id, question_id, user_id, content, thumbs_up_count, thumbs_down_count, is_flagged, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, 0, 0, false, NOW())
         RETURNING *`,
        [questionId, user.id, content.trim()]
      );

      const comment = snakeToCamel(result.rows[0]);
      comment.username = user.username;
      comment.userVote = null;

      res.status(201).json(comment);
    } catch (e: any) {
      console.error("Error posting comment:", e);
      res.status(500).json({ error: "Failed to post comment" });
    }
  });

  app.post("/api/question-comments/:commentId/vote", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { commentId } = req.params;
      const { voteType } = req.body;

      if (!["up", "down"].includes(voteType)) {
        return res.status(400).json({ error: "voteType must be 'up' or 'down'" });
      }

      const commentExists = await pool.query(
        `SELECT id FROM question_comments WHERE id = $1`,
        [commentId]
      );
      if (commentExists.rows.length === 0) {
        return res.status(404).json({ error: "Comment not found" });
      }

      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        const existingVote = await client.query(
          `SELECT id, vote_type FROM question_comment_votes WHERE comment_id = $1 AND user_id = $2 FOR UPDATE`,
          [commentId, user.id]
        );

        if (existingVote.rows.length > 0) {
          const existing = existingVote.rows[0];
          if (existing.vote_type === voteType) {
            await client.query(`DELETE FROM question_comment_votes WHERE id = $1`, [existing.id]);
            const col = voteType === "up" ? "thumbs_up_count" : "thumbs_down_count";
            await client.query(
              `UPDATE question_comments SET ${col} = GREATEST(${col} - 1, 0) WHERE id = $1`,
              [commentId]
            );
          } else {
            await client.query(
              `UPDATE question_comment_votes SET vote_type = $1 WHERE id = $2`,
              [voteType, existing.id]
            );
            const addCol = voteType === "up" ? "thumbs_up_count" : "thumbs_down_count";
            const removeCol = voteType === "up" ? "thumbs_down_count" : "thumbs_up_count";
            await client.query(
              `UPDATE question_comments SET ${addCol} = ${addCol} + 1, ${removeCol} = GREATEST(${removeCol} - 1, 0) WHERE id = $1`,
              [commentId]
            );
          }
        } else {
          await client.query(
            `INSERT INTO question_comment_votes (id, comment_id, user_id, vote_type, created_at)
             VALUES (gen_random_uuid(), $1, $2, $3, NOW())
             ON CONFLICT (comment_id, user_id) DO UPDATE SET vote_type = $3`,
            [commentId, user.id, voteType]
          );
          const col = voteType === "up" ? "thumbs_up_count" : "thumbs_down_count";
          await client.query(
            `UPDATE question_comments SET ${col} = ${col} + 1 WHERE id = $1`,
            [commentId]
          );
        }

        await client.query("COMMIT");
      } catch (txErr) {
        await client.query("ROLLBACK");
        throw txErr;
      } finally {
        client.release();
      }

      const updatedComment = await pool.query(
        `SELECT qc.*, u.username FROM question_comments qc LEFT JOIN users u ON u.id = qc.user_id WHERE qc.id = $1`,
        [commentId]
      );

      const currentVote = await pool.query(
        `SELECT vote_type FROM question_comment_votes WHERE comment_id = $1 AND user_id = $2`,
        [commentId, user.id]
      );

      const comment = snakeToCamel(updatedComment.rows[0]);
      comment.userVote = currentVote.rows[0]?.vote_type || null;

      res.json(comment);
    } catch (e: any) {
      console.error("Error voting on comment:", e);
      res.status(500).json({ error: "Failed to process vote" });
    }
  });

  const flagLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    keyGenerator: (req: any) => {
      return (req as any).__rateLimitUser || "anonymous";
    },
    message: { error: "Too many reports. Please try again later." },
    validate: false,
  });

  app.post("/api/question-comments/:commentId/flag", async (req, res, next) => {
    const user = await resolveAuthUser(req);
    if (!user) return res.status(401).json({ error: "Authentication required" });
    (req as any).__rateLimitUser = user.id;
    next();
  }, flagLimiter, async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { commentId } = req.params;

      const commentCheck = await pool.query(
        `SELECT id, user_id FROM question_comments WHERE id = $1`,
        [commentId]
      );
      if (commentCheck.rows.length === 0) {
        return res.status(404).json({ error: "Comment not found" });
      }
      if (commentCheck.rows[0].user_id === user.id) {
        return res.status(400).json({ error: "You cannot flag your own comment" });
      }

      await pool.query(
        `CREATE TABLE IF NOT EXISTS question_comment_flags (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          comment_id VARCHAR NOT NULL,
          user_id VARCHAR NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          UNIQUE(comment_id, user_id)
        )`
      );

      const alreadyFlagged = await pool.query(
        `SELECT id FROM question_comment_flags WHERE comment_id = $1 AND user_id = $2`,
        [commentId, user.id]
      );
      if (alreadyFlagged.rows.length > 0) {
        return res.json({ success: true, message: "Already reported" });
      }

      await pool.query(
        `INSERT INTO question_comment_flags (comment_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [commentId, user.id]
      );

      const flagCount = await pool.query(
        `SELECT COUNT(*)::int as count FROM question_comment_flags WHERE comment_id = $1`,
        [commentId]
      );

      if ((flagCount.rows[0]?.count || 0) >= FLAG_THRESHOLD) {
        await pool.query(
          `UPDATE question_comments SET is_flagged = true WHERE id = $1`,
          [commentId]
        );
      }

      res.json({ success: true });
    } catch (e: any) {
      console.error("Error flagging comment:", e);
      res.status(500).json({ error: "Failed to report comment" });
    }
  });

  app.get("/api/admin/recent-comments", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const limit = parseInt(req.query.limit as string) || 100;
      const result = await pool.query(
        `SELECT qc.*, u.username
         FROM question_comments qc
         LEFT JOIN users u ON u.id = qc.user_id
         ORDER BY qc.created_at DESC
         LIMIT $1`,
        [Math.min(limit, 500)]
      );

      res.json(snakeToCamel(result.rows));
    } catch (e: any) {
      console.error("Error fetching recent comments:", e);
      res.status(500).json({ error: "Failed to load recent comments" });
    }
  });

  app.get("/api/admin/flagged-comments", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `SELECT qc.*, u.username
         FROM question_comments qc
         LEFT JOIN users u ON u.id = qc.user_id
         WHERE qc.is_flagged = true
         ORDER BY qc.created_at DESC
         LIMIT 200`
      );

      res.json(snakeToCamel(result.rows));
    } catch (e: any) {
      console.error("Error fetching flagged comments:", e);
      res.status(500).json({ error: "Failed to load flagged comments" });
    }
  });

  app.patch("/api/admin/flagged-comments/:commentId", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { commentId } = req.params;
      const { action } = req.body;

      if (action === "dismiss") {
        await pool.query(
          `UPDATE question_comments SET is_flagged = false WHERE id = $1`,
          [commentId]
        );
        await pool.query(
          `DELETE FROM question_comment_flags WHERE comment_id = $1`,
          [commentId]
        ).catch(() => {});
        res.json({ success: true, action: "dismissed" });
      } else if (action === "delete") {
        await pool.query(`DELETE FROM question_comment_votes WHERE comment_id = $1`, [commentId]);
        await pool.query(`DELETE FROM question_comment_flags WHERE comment_id = $1`, [commentId]).catch(() => {});
        await pool.query(`DELETE FROM question_comments WHERE id = $1`, [commentId]);
        res.json({ success: true, action: "deleted" });
      } else {
        res.status(400).json({ error: "action must be 'dismiss' or 'delete'" });
      }
    } catch (e: any) {
      console.error("Error handling flagged comment:", e);
      res.status(500).json({ error: "Failed to process action" });
    }
  });
}
