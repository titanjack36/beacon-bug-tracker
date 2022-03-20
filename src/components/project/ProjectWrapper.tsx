import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../storeHooks";
import '../../styles/Project.scss';
import SideView from "../side-view/SideView";
import { fetchTasks, setOpenTasks } from "../../features/taskSlice";
import Resizable, { ResizableConfig } from "../common/Resizable";
import Project from "./Project";
import { setShowProject } from "../../features/sideViewSlice";

const initialResizeWidth = 800;

const resizableConfig: ResizableConfig = {
  initialWidth: `${800}px`,
  directions: ['west']
}

const initialResizableStyle: React.CSSProperties = {
  minWidth: '600px',
  maxWidth: '100%'
};

function ProjectWrapper() {
  const dispatch = useAppDispatch();
  const loadedTasks = useAppSelector(state => state.task.loadedTasks);
  const openTaskStates = useAppSelector(state => state.task.openTaskStates);
  const [hideProjectWindow, setHideProjectWindow] = useState(false);
  const [resizableStyle, setResizableStyle] = useState(initialResizableStyle);
  const [resizeWidth, setResizeWidth] = useState(initialResizeWidth);
  const wrapperElRef = useRef<HTMLDivElement>(null);

  let [searchParams, setSearchParams] = useSearchParams();
  const tasksSearchParams = searchParams.get('tasks');
  useEffect(() => {
    const queryTaskIds = tasksSearchParams?.split(',') || [];
    if (!queryTaskIds.length && loadedTasks.length) {
      // show previously loaded tasks in query params
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tasks', loadedTasks.map(t => t.id).join(','));
      setSearchParams(newSearchParams);

    } else if (queryTaskIds.length) {
      const tasksToLoad: string[] = [];
      const openTaskIdSet = new Set(openTaskStates.map(s => s.taskId));
      // load query parameter tasks if not already loaded
      queryTaskIds.forEach(taskId => {
        if (!openTaskIdSet.has(taskId)) {
          tasksToLoad.push(taskId);
        }
      });
      if (tasksToLoad.length) {
        dispatch(setOpenTasks(queryTaskIds));
        dispatch(fetchTasks({ ids: tasksToLoad }));
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

  useEffect(() => {
    const wrapperEl = wrapperElRef.current;
    if (wrapperEl) {
      const resizeObs = new ResizeObserver(() => {
        handleResizeChange(resizeWidth);
      });
      resizeObs.observe(wrapperEl);
  
      return () => resizeObs.unobserve(wrapperEl);
    }
  }, [wrapperElRef, resizeWidth]);
  
  const handleResizeChange = (newWidth: number, _?: number) => {
    if (newWidth !== resizeWidth) {
      setResizeWidth(newWidth);
    }
    if (!wrapperElRef.current) {
      return;
    }
    const wrapperWidth = wrapperElRef.current.offsetWidth;
    if (newWidth > wrapperWidth * 0.75) {
      dispatch(setShowProject(true));
      setHideProjectWindow(true);
      setResizableStyle({...resizableStyle, minWidth: '100%'});
    } else {
      dispatch(setShowProject(false));
      setHideProjectWindow(false);
      setResizableStyle(initialResizableStyle);
    }
  };

  return (
    <div className="project-wrapper" ref={wrapperElRef}>
      { !hideProjectWindow && <Project /> }
      {
        !!openTaskStates.length &&
          <Resizable config={resizableConfig} style={resizableStyle} onSizeChange={handleResizeChange}>
            <SideView />
          </Resizable>
      }
    </div>
  );
}

export default ProjectWrapper;