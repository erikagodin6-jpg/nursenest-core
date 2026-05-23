export const revalidate = 3600;
import { traceLayout } from "@/build/tracing";

const AlliedHealthBlogLayout = traceLayout(
  import.meta,
  function AlliedHealthBlogLayout({ children }: { children: React.ReactNode }) {
    return children;
  },
  { name: "AlliedHealthBlogLayout" },
);

export default AlliedHealthBlogLayout;
