"use client";

type Props = {
  initialPosts?: any;
  [key: string]: any;
};

export function AdminBlogSchedulerPanel(props: Props) {
  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold">Blog Scheduler</h1>

      <p className="text-sm text-muted-foreground">
        Scheduler temporarily disabled.
      </p>

      {/* prevents TS errors by "using" props */}
      {props.initialPosts ? null : null}
    </div>
  );
}