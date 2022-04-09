import { closeTask } from "../../features/taskSlice";
import { selectProject, selectTask } from "../../features/sideViewSlice";
import { useAppDispatch, useAppSelector } from "../../storeHooks";
import '../../styles/SideView.scss';

type ClickEvent = React.MouseEvent<HTMLButtonElement>;

type SideViewMenuProps = {
  showProject: boolean;
}

function SideViewMenu({ showProject }: SideViewMenuProps) {
  const dispatch = useAppDispatch();
  
  const { openTaskStates, selectedTaskState } = useAppSelector(state => state.sideView);
  const selectedProject = useAppSelector(state => state.project.currentProject);

  const handleCloseTask = (event: ClickEvent, taskId: string) => {
    event.stopPropagation();
    dispatch(closeTask(taskId));
  };

  const handleSelectTask = (taskId: string) => {
    dispatch(selectTask(taskId));
  };

  const handleSelectProject = () => {
    dispatch(selectProject());
  };

  return (
    <div className="side-view-menu">
      {
        showProject && selectedProject && 
          <div role="button"
              className={selectedTaskState ? "menu-tab" : "menu-tab selected" }
              onClick={handleSelectProject}
              >
            <div className="text">
              <div className="title">{selectedProject.name}</div>
              <div className="subtitle">{selectedProject.id}</div>
            </div>
          </div>
      }
      {
        openTaskStates.map(({ taskId, loadedTask }) => {
          const isSelected = taskId === selectedTaskState?.taskId;
          return (
            <div key={taskId} role="button"
                className={isSelected ? "menu-tab selected" : "menu-tab"}  
                onClick={() => handleSelectTask(taskId)}>
              <div className="text">
                <div className="title">{loadedTask ? loadedTask.title : taskId }</div>
                <div className="subtitle">{loadedTask ? loadedTask.id : 'Loading...'}</div>
              </div>
              <button onClick={(event) => handleCloseTask(event, taskId)}>
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