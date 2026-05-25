import { AuthStatusIsland } from './AuthStatusIsland';

const ResetPassword = () => {
  return (
    <Suspense fallback={<StaticPlaceholder />}>
      <AuthStatusIsland />
    </Suspense>
  );
};

export default ResetPassword;
