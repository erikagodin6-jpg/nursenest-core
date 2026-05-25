import { Suspense } from 'react';
import { StaticPlaceholder } from './StaticPlaceholder';

// Removed force-dynamic declaration
// export const dynamic = "force-dynamic";

// Added revalidate for static rendering
export const revalidate = 1800;

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        {/* Removed headers() and cookies() usage in layout */}
        {/* <header /> */}
      </header>
      <main>
        <Suspense fallback={<StaticPlaceholder />}>
          {children}
        </Suspense>
      </main>
      <footer>
        {/* Removed Prisma usage inside layout */}
        {/* <Prisma /> */}
      </footer>
    </div>
  );
};

export default Layout;
