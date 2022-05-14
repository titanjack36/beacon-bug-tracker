import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import './styles/App.scss';
import Home from './components/home/Home';

import LeftMenu from './components/menu/LeftMenu';
import TopMenu from './components/menu/TopMenu';
import ProjectWrapper from './components/project/ProjectWrapper';
import AuthGuard from "./components/nav/AuthGuard";
import Landing from "./components/landing/Landing";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const { user, getAccessTokenSilently } = useAuth0();
  
  const setApiAccessToken = async (): Promise<string | null> => {
    if (user) {
      const token = await getAccessTokenSilently();
      console.log(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return token;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      return null;
    }
  };

  useEffect(() => {
    setApiAccessToken();
  }, [user]);

  return (
    <BrowserRouter>
      <div id="app" className="theme-light">
        <LeftMenu />
        <div className="right-content">
          <TopMenu />
          <Routes>
            <Route path="projects/:projectId/*" element={<AuthGuard component={ProjectWrapper} />} />
            <Route path="home/*" element={<AuthGuard component={Home} />} />
            <Route path="" element={<Landing />} />
            <Route path="*" element={<Navigate to="home" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
