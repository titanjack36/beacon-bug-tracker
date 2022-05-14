import { withAuthenticationRequired } from '@auth0/auth0-react';
import RedirectLoading from './RedirectLoading';

type AuthGuardProps = {
  component: React.ComponentType<object>;
};

export default function AuthGuard({component}: AuthGuardProps) {
  const ProtectedComponent =  withAuthenticationRequired(component, {
    onRedirecting: () => <RedirectLoading />
  });
  return <ProtectedComponent />;
}
