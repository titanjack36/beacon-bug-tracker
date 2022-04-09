import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../storeHooks";
import '../../styles/Project.scss';
import SideView from "../side-view/SideView";
import Resizable, { ResizableConfig } from "../common/Resizable";
import Project from "./Project";
import { fetchTasks, openTasks, selectTask } from "../../features/sideViewSlice";
import { showErrorToast } from "../../utils/util";
import { AxiosError } from "axios";

const initialResizeWidth = 800;
const collapseWidth = 550;

const initialResizableStyle: React.CSSProperties = {
  minWidth: '600px',
  maxWidth: '100%'
};

function ProjectWrapper() {
  const dispatch = useAppDispatch();
  const openTaskStates = useAppSelector(state => state.sideView.openTaskStates);
  let [searchParams, setSearchParams] = useSearchParams();
  const tasksSearchParams = searchParams.get('tasks');

  useEffect(() => {
    const queryTaskIds = tasksSearchParams?.split(',') || [];
    if (!queryTaskIds.length && openTaskStates.length) {
      // show previously loaded tasks in query params
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tasks', openTaskStates.map(s => s.taskId).join(','));
      setSearchParams(newSearchParams);

    } else if (queryTaskIds.length) {
      const newTaskIds: string[] = [];
      const openTaskIdSet = new Set(openTaskStates.map(s => s.taskId));
      // load query parameter tasks if not already loaded
      queryTaskIds.forEach(taskId => {
        if (!openTaskIdSet.has(taskId)) {
          newTaskIds.push(taskId);
        }
      });
      if (newTaskIds.length) {
        dispatch(openTasks(newTaskIds));
        dispatch(selectTask(newTaskIds[0]));
        dispatch(fetchTasks({ taskIds: newTaskIds })).unwrap()
          .then(({ errorTaskIds }) => {
            if (errorTaskIds?.length) {
              throw { errorTaskIds };
            }
          })
          .catch((err: AxiosError & { errorTaskIds: string[] }) => {
            console.log(err);
            const failedFetchTaskIds = err.errorTaskIds || newTaskIds;
            showErrorToast(`Failed to load tasks ${failedFetchTaskIds.join(', ')}. Click to retry.`);
          });
      }
    }
  }, [tasksSearchParams]);

  useEffect(() => {
    // when tasks are removed, update query params
    const newSearchParams = new URLSearchParams(searchParams);
    const openTaskIds = openTaskStates.map(s => s.taskId);
    if (!openTaskIds.length) {
      newSearchParams.delete('tasks');
    } else {
      newSearchParams.set('tasks', Array.from(openTaskIds).join(','));
    }
    setSearchParams(newSearchParams);
  }, [openTaskStates.length]);


  const [hideProjectWindow, setHideProjectWindow] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [resizableStyle, setResizableStyle] = useState(initialResizableStyle);
  const [resizeWidth, setResizeWidth] = useState(initialResizeWidth);
  const wrapperElRef = useRef<HTMLDivElement>(null);

  const handleResizeChange = (newWidth: number, _?: number) => {
    if (newWidth !== resizeWidth) {
      setResizeWidth(newWidth);
    }
    if (!wrapperElRef.current) {
      return;
    }
    const wrapperWidth = wrapperElRef.current.offsetWidth;
    if (wrapperWidth - newWidth < collapseWidth) {
      if (!hideProjectWindow) {
        setShowProject(true);
        setHideProjectWindow(true);
        setResizableStyle({...resizableStyle, minWidth: '100%'});
      }
    } else if (hideProjectWindow) {
      setShowProject(false);
      setHideProjectWindow(false);
      setResizableStyle(initialResizableStyle);
    }
  };

  useEffect(() => {
    const wrapperEl = wrapperElRef.current;
    if (wrapperEl) {
      const resizeObs = new ResizeObserver(() => handleResizeChange(resizeWidth));
      resizeObs.observe(wrapperEl);
  
      return () => resizeObs.unobserve(wrapperEl);
    }
  }, [wrapperElRef, resizeWidth, hideProjectWindow]);

  const resizableConfig: ResizableConfig = {
    initialWidth: `${resizeWidth}px`,
    directions: ['west']
  };

  return (
    <div className="project-wrapper" ref={wrapperElRef}>
      <Project className={(!openTaskStates.length || !hideProjectWindow) ? '' : 'd-none'}/>
      {
        !!openTaskStates.length &&
          <Resizable config={resizableConfig} style={resizableStyle} onSizeChange={handleResizeChange}>
            <SideView showProject={showProject} />
          </Resizable>
      }
    </div>
  );
}

export default ProjectWrapper;