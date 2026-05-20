import { createDailyJobs, runGenerationJob } from "./content-pipeline";
import { emitStructuredLog } from "./log-sink";

let schedulerTimer: NodeJS.Timeout | null = null;

function getNextRunTime(): Date {
  const now = new Date();
  const toronto = new Date(now.toLocaleString("en-US", { timeZone: "America/Toronto" }));
  const target = new Date(toronto);
  target.setHours(2, 0, 0, 0);

  if (target <= toronto) {
    target.setDate(target.getDate() + 1);
  }

  const diffMs = target.getTime() - toronto.getTime();
  return new Date(now.getTime() + diffMs);
}

async function runDailyPipeline() {
  emitStructuredLog({
    level: "info",
    type: "content_scheduler_start",
    job: "daily_content_pipeline",
    msg: "Starting daily content generation pipeline",
  });
  try {
    const jobIds = await createDailyJobs();
    emitStructuredLog({
      level: "info",
      type: "content_scheduler_jobs_created",
      job: "daily_content_pipeline",
      msg: `Created ${jobIds.length} jobs for today`,
      jobCount: jobIds.length,
    });

    for (const jobId of jobIds) {
      try {
        const result = await runGenerationJob(jobId);
        emitStructuredLog({
          level: "info",
          type: "content_scheduler_job_finish",
          job: "daily_content_pipeline",
          pipelineJobId: jobId,
          msg: "Job completed",
        });
      } catch (error) {
        emitStructuredLog(
          {
            level: "error",
            type: "content_scheduler_job_failure",
            job: "daily_content_pipeline",
            pipelineJobId: jobId,
            msg: error instanceof Error ? error.message : String(error),
          },
          "error",
        );
      }
    }

    emitStructuredLog({
      level: "info",
      type: "content_scheduler_finish",
      job: "daily_content_pipeline",
      msg: "Daily pipeline complete",
    });
  } catch (error) {
    emitStructuredLog(
      {
        level: "error",
        type: "content_scheduler_failure",
        job: "daily_content_pipeline",
        msg: error instanceof Error ? error.message : String(error),
      },
      "error",
    );
  }
}

function scheduleNext() {
  const nextRun = getNextRunTime();
  const delayMs = nextRun.getTime() - Date.now();

  emitStructuredLog({
    level: "info",
    type: "content_scheduler_scheduled",
    job: "daily_content_pipeline",
    msg: `Next pipeline run at ${nextRun.toISOString()} (${Math.round(delayMs / 3600000)}h from now)`,
    nextRunAt: nextRun.toISOString(),
  });

  schedulerTimer = setTimeout(async () => {
    await runDailyPipeline();
    scheduleNext();
  }, delayMs);
}

export function startContentScheduler() {
  emitStructuredLog({
    level: "info",
    type: "content_scheduler_init",
    job: "daily_content_pipeline",
    msg: "Content generation scheduler initialized",
  });
  scheduleNext();
}

export function stopContentScheduler() {
  if (schedulerTimer) {
    clearTimeout(schedulerTimer);
    schedulerTimer = null;
    emitStructuredLog({
      level: "info",
      type: "content_scheduler_stop",
      job: "daily_content_pipeline",
      msg: "Scheduler stopped",
    });
  }
}
