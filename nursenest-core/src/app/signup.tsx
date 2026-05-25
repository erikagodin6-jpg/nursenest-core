import { AuthStatusIsland } from './AuthStatusIsland';

const Signup = () => {
  return (
    <Suspense fallback={<StaticPlaceholder />}>
      <AuthStatusIsland />
    </Suspense>
  );
};

export default Signup;
