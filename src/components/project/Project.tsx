import { AxiosError } from "axios";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "../../storeHooks";
import { showErrorToast } from "../../utils/util";
import TaskBoard from "../tasks/TaskBoard";
import TaskList from "../tasks/TaskList";
import ProjectMenuLink from "./ProjectMenuLink";

function Project() {
  const project = useAppSelector(state => state.project.selectedProject);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ invalidProjectId, setInvalidProjectId ] = useState<string | undefined>(undefined);

  const handleLoad = () => setIsLoading(false);

  const handleError = (projId: string, err: AxiosError) => {
    if (err.response?.status === 400) {
      setInvalidProjectId(projId);
    } else {
      showErrorToast(`Failed to load project '${projId}'. Click to retry.`);
    }
  };

  if (invalidProjectId) {
    return <div>The project with ID {invalidProjectId} does not exist</div>;
  }

  return (
    <div className="project">
      {
        (isLoading || !project) ?
          (
            <div>Loading project</div>
          ) : (
            <div className="dash">
              <div className="top">
                <div className="title">
                  {project.name}
                </div>
                <button className="btn btn-primary new-task-btn">
                  <span className="icon icon-plus" />
                  Create Task
                </button>
              </div>
              <div className="menu">
                <ProjectMenuLink to="board">
                  Board
                </ProjectMenuLink>
                <ProjectMenuLink to="list">
                  List
                </ProjectMenuLink>
              </div>
            </div>
          )
      }
      <Routes>
        <Route path="board" element={<TaskBoard onLoad={handleLoad} onError={handleError}/>} />
        <Route path="list" element={<TaskList />} />
        <Route path="*" element={<Navigate to="board" />} />
      </Routes>
    </div>
  );
}

export default Project;