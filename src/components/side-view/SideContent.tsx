import { useAppSelector } from "../../storeHooks";
import '../../styles/SideView.scss';
import Project from "../project/Project";
import 'react-quill/dist/quill.snow.css';
import TaskView from "../tasks/TaskView";

function SideContent() {
  const selectedTaskState = useAppSelector(state => state.sideView.selectedTaskState);

  if (!selectedTaskState) {
    return <Project />;
  }
  if (selectedTaskState.state === 'invalid') {
    return <div>Invalid task ID {selectedTaskState.taskId}</div>;
  }
  if (selectedTaskState.state === 'error') {
    return <div>Error loading task with ID {selectedTaskState.taskId}</div>;
  }
  if (!selectedTaskState?.loadedTask) {
    return <div>Loading task</div>;
  }
  
  return <TaskView task={selectedTaskState.loadedTask}/>
}

export default SideContent;