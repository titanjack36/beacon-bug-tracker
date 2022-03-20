import { login } from "../features/userSlice";
import { useAppDispatch } from "../storeHooks";

function Login() {
  const dispatch = useAppDispatch();

  return (
    <button type="submit" onClick={() => dispatch(login())}>Login</button>
  );
}

export default Login;