import { useAppDispatch, useAppSelector } from "../../storeHooks";
import '../../styles/SideView.scss';
import Project from "../project/Project";
import 'react-quill/dist/quill.snow.css';
import TaskView from "../tasks/TaskView";
import { OpenTaskState, Task, TaskEditState } from "../../models/task.type";
import { updateTaskState } from "../../features/sideViewSlice";
import { DeepPartial } from "../../models/extended.type";
import { useEffect } from "react";
import { useCompare, useStateRef } from "../../utils/util";

function SideContent() {
  const selectedTaskState = useAppSelector(state => state.sideView.selectedTaskState);
  const [localTaskState, setLocalTaskState, localTaskStateRef] 
    = useStateRef<OpenTaskState | undefined>(selectedTaskState);
  const dispatch = useAppDispatch();

  // on switch task, send latest editState to store
  useEffect(() => {
    if (localTaskState && selectedTaskState?.taskId !== localTaskState.taskId) {
      dispatch(updateTaskState(localTaskState));
    }
  }, [selectedTaskState, localTaskState, dispatch]);

  useEffect(() => {
    console.log('setlocaltaskState', selectedTaskState);
    setLocalTaskState(selectedTaskState);
  }, [selectedTaskState, setLocalTaskState]);

  // on component unmount, save editState to store
  useEffect(() => {
    return () => {
      if (localTaskStateRef.current) {
        dispatch(updateTaskState(localTaskStateRef.current));
      }
    }
  }, [dispatch, localTaskStateRef]);

  const handleStateUpdated = (editState: TaskEditState) => {
    console.log('handleStateUpdated', editState);
    setLocalTaskState((prevState) => ({ ...prevState!, editState }));
  };

  const handleTaskUpdated = (task: Task) => {
    // const newState = { ...localTaskStateRef.current!, loadedTask: task };
    // console.log('handletaskupdated', localTaskState, localTaskStateRef.current, newState);
    setLocalTaskState((prevState) => ({ ...prevState!, loadedTask: task }));
  }

  if (!selectedTaskState) {
    return <Project />;
  }
  if (selectedTaskState.state === 'invalid') {
    return <div>Invalid task ID {selectedTaskState.taskId}</div>;
  }
  if (selectedTaskState.state === 'error') {
    return <div>Error loading task with ID {selectedTaskState.taskId}</div>;
  }
  if (!localTaskState?.loadedTask || !localTaskState?.editState) {
    return <div>Loading task</div>;
  }

  console.log(localTaskState);
  
  return (
    <TaskView
        task={localTaskState.loadedTask}
        state={localTaskState.editState}
        onStateUpdated={handleStateUpdated}
        onTaskUpdated={handleTaskUpdated} />
  );
}

export default SideContent;