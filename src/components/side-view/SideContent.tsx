import { useEffect, useState } from "react";
import { Task } from "../../models/task.type";
import { useAppSelector } from "../../storeHooks";
import { showErrorToast } from "../../utils/util";
import '../../styles/SideView.scss';
import Project from "../project/Project";
import 'react-quill/dist/quill.snow.css';
import TaskView from "../tasks/TaskView";

function SideContent() {
  const selectedTaskIdx = useAppSelector(state => state.sideView.selectedTaskIdx);
  const openTaskStates = useAppSelector(state => state.task.openTaskStates);
  const loadedTasks = useAppSelector(state => state.task.loadedTasks);
  const selectedTaskState = openTaskStates[selectedTaskIdx];
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectedTaskState?.state === 'loaded') {
      const matchingTask = loadedTasks.find(t => t.id === selectedTaskState.taskId);
      setTask(matchingTask);
      if (matchingTask) {
        setDescription(matchingTask.description);
      } else {
        showErrorToast(`Could not find loaded task with ID ${selectedTaskState.taskId}`);
      }
    } else {
      setTask(undefined);
    }
  }, [selectedTaskState]);

  const isProjectSelected = useAppSelector(state => state.sideView.isProjectSelected);
  if (isProjectSelected) {
    return <Project />;
  }
  if (!selectedTaskState) {
    return <div>No tasks selected</div>;
  }
  if (selectedTaskState.state === 'invalid') {
    return <div>Invalid task ID {selectedTaskState.taskId}</div>;
  }
  if (selectedTaskState.state === 'loading' || !task) {
    return <div>Loading task</div>;
  }
  
  return <TaskView task={task}/>
}

export default SideContent;