import { Suspense } from 'react';
import { StaticPlaceholder } from './StaticPlaceholder';

const AuthStatusIsland = () => {
  return (
    <Suspense fallback={<StaticPlaceholder />}>
      {/* Auth-sensitive content */}
    </Suspense>
  );
};

export default AuthStatusIsland;
