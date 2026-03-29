import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto mt-16 w-full max-w-xl px-6">
      <div className="nn-card p-8">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-3 text-muted">This route does not exist in NurseNest Core.</p>
        <Link className="mt-5 inline-block rounded-xl bg-primary px-4 py-2 font-semibold" href="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}
