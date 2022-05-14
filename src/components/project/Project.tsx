import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { fetchProject } from "../../features/projectSlice";
import { createNewTask } from "../../features/sideViewSlice";
import { useAppDispatch, useAppSelector } from "../../storeHooks";
import { showErrorToast } from "../../utils/util";
import TaskBoard from "../tasks/TaskBoard";
import TaskList from "../tasks/TaskList";
import MemberView from "./MemberView";
import ProjectMenuLink from "./ProjectMenuLink";

function Project({ className='', ...props }: React.AllHTMLAttributes<HTMLDivElement>) {
  const dispatch = useAppDispatch();
  const { projectId } = useParams<"projectId">();
  const project = useAppSelector(state => state.project.currentProject);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ invalidProjectId, setInvalidProjectId ] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsLoading(true);
    if (projectId && projectId !== project?.id) {
      dispatch(fetchProject({ id: projectId })).unwrap()
        .then(() => setIsLoading(false))
        .catch((err: AxiosError) => {
          if (err.response?.status === 400) {
            setInvalidProjectId(projectId);
          } else {
            showErrorToast(`Failed to load project '${projectId}'. Click to retry.`);
          }
        });
    } else {
      setIsLoading(false);
    }
  }, [projectId]);

  if (invalidProjectId) {
    return <div>The project with ID {invalidProjectId} does not exist</div>;
  }

  return (
    <div className={`project ${className}`} {...props}>
      {
        (isLoading || !project) ?
          (
            <div>Loading project</div>
          ) : (
            <div className="dash">
              <div className="top">
                <div className="left">
                  <div className="title">
                    {project.name}
                  </div>
                  <MemberView members={project.members}/>
                </div>
                <button className="btn btn-primary new-task-btn" onClick={() => dispatch(createNewTask(project))}>
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
        <Route path="board" element={<TaskBoard />} />
        <Route path="list" element={<TaskList />} />
        <Route path="*" element={<Navigate to="board" />} />
      </Routes>
    </div>
  );
}

export default Project;