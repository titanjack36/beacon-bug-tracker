import { useAppSelector } from "../storeHooks";
import Login from "./Login";

type AuthGuardProps = {
  children: any;
}

function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);

  if (isAuthenticated) {
    return children;
  } else {
    return (<Login />);
  }
}

export default AuthGuard;