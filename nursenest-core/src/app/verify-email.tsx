import { AuthStatusIsland } from './AuthStatusIsland';

const VerifyEmail = () => {
  return (
    <Suspense fallback={<StaticPlaceholder />}>
      <AuthStatusIsland />
    </Suspense>
  );
};

export default VerifyEmail;
