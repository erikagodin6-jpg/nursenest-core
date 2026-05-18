import SitePageRenderer from "@/components/SitePageRenderer";

export default function Page({ params }: { params: { page: string } }) {
  const allowed = ["faq", "about", "terms", "legal", "alliedHealth"];

  if (!allowed.includes(params.page)) {
    return <div>Page not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <SitePageRenderer page={params.page as any} />
    </div>
  );
}
