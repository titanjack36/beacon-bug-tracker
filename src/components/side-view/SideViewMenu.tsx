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
        openTaskStates.map(({ state, taskId, taskTitle, loadedTask }) => {
          const isSelected = taskId === selectedTaskState?.taskId;
          let title, subtitle;
          if (loadedTask) {
            title = taskTitle!;
            subtitle = taskId;
          } else if (state === 'draft') {
            title = taskTitle! || 'Untitled';
            subtitle = 'Draft';
          } else {
            title = taskId;
            subtitle = 'Loading...';
          }

          return (
            <div key={taskId} role="button"
                className={isSelected ? "menu-tab selected" : "menu-tab"}  
                onClick={() => handleSelectTask(taskId)}>
              <div className="text">
                <div className="title">{title}</div>
                <div className="subtitle">{subtitle}</div>
              </div>
              <div className="close-wrapper">
                <button className="close-btn" onClick={(event) => handleCloseTask(event, taskId)}>
                  <div className="icon icon-close"/>
                </button>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

export default SideViewMenu;