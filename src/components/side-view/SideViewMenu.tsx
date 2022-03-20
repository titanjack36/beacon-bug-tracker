import { closeTask } from "../../features/taskSlice";
import { selectProject, setSelectedTaskIdx } from "../../features/sideViewSlice";
import { useAppDispatch, useAppSelector } from "../../storeHooks";
import '../../styles/SideView.scss';
import { useEffect } from "react";
import { usePrevious } from "../../utils/util";

type ClickEvent = React.MouseEvent<HTMLButtonElement>;

function SideViewMenu() {
  const dispatch = useAppDispatch();
  const selectedTaskIdx = useAppSelector(state => state.sideView.selectedTaskIdx);
  const openTaskStates = useAppSelector(state => state.task.openTaskStates);
  const previousOpenTaskCount = usePrevious(openTaskStates.length) || 0;
  const loadedTasks = useAppSelector(state => state.task.loadedTasks);
  const loadedTaskMap = new Map(loadedTasks.map(t => [t.id, t]));
  
  const isProjectSelected = useAppSelector(state => state.sideView.isProjectSelected);
  const selectedProject = useAppSelector(state => state.project.selectedProject);
  const showProjectTab = useAppSelector(state => state.sideView.showProject);

  // display newly opened tasks
  // useEffect(() => {
  //   if (openTaskStates.length > previousOpenTaskCount) {
  //     dispatch(setSelectedTaskIdx(openTaskStates.length - 1));
  //   }
  // }, [openTaskStates.length]);

  const handleCloseTask = (event: ClickEvent, taskId: string, taskIdx: number) => {
    event.stopPropagation();
    if (selectedTaskIdx === taskIdx) {
      let newSelectedTaskIdx = 0;
      if (selectedTaskIdx > 0) {
        newSelectedTaskIdx = selectedTaskIdx - 1;
      } else if (openTaskStates.length > 2) {
        newSelectedTaskIdx = 1;
      }
      dispatch(setSelectedTaskIdx(newSelectedTaskIdx));
    }
    dispatch(closeTask(taskId));
  };

  const handleSelectTask = (taskIdx: number) => {
    dispatch(setSelectedTaskIdx(taskIdx));
  }

  const handleSelectProject = () => {
    dispatch(selectProject());
  }

  return (
    <div className="side-view-menu">
      {
        showProjectTab && selectedProject && 
          <div role="button"
              className={isProjectSelected ? "menu-tab selected" : "menu-tab"}
              onClick={handleSelectProject}
              >
            <div className="text">
              <div className="title">{selectedProject.name}</div>
              <div className="subtitle">{selectedProject.id}</div>
            </div>
          </div>
      }
      {
        openTaskStates.map((taskState, taskIdx) => {
          const loadedTask = loadedTaskMap.get(taskState.taskId);
          const isLoaded = taskState.state === 'loaded' && loadedTask;
          const isSelected = !isProjectSelected && taskIdx === selectedTaskIdx;
          return (
            <div key={taskState.taskId} role="button"
                className={isSelected ? "menu-tab selected" : "menu-tab"}  
                onClick={() => handleSelectTask(taskIdx)}>
              <div className="text">
                <div className="title">{isLoaded ? loadedTask.title : taskState.taskId }</div>
                <div className="subtitle">{isLoaded ? loadedTask.id : 'Loading...'}</div>
              </div>
              <button onClick={(event) => handleCloseTask(event, taskState.taskId, taskIdx)}>
                <div className="icon icon-plus"/>
              </button>
            </div>
          );
        })
      }
    </div>
  );
}

export default SideViewMenu;