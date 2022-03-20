import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import './styles/App.scss';
import AuthGuard from './components/AuthGuard';
import Home from './components/home/Home';
import { store } from './store';
import LeftMenu from './components/menu/LeftMenu';
import TopMenu from './components/menu/TopMenu';
import ProjectWrapper from './components/project/ProjectWrapper';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthGuard>
          <div id="app" className="theme-light">
            <LeftMenu />
            <div className="right-content">
              <TopMenu />
              <Routes>
                <Route path="projects/:projectId/*" element={<ProjectWrapper />} />
                <Route path="home" element={<Home />} />
                <Route path="*" element={<Navigate to="home" />} />
              </Routes>
            </div>
          </div>
        </AuthGuard>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
