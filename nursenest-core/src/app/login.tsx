import { AuthStatusIsland } from './AuthStatusIsland';

const Login = () => {
  return (
    <Suspense fallback={<StaticPlaceholder />}>
      <AuthStatusIsland />
    </Suspense>
  );
};

export default Login;
