import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
// import { fetchTask } from "../../features/task/taskSlice";
import { useAppDispatch, useAppSelector } from "../../storeHooks";

function TaskItem() {
  // const { taskId } = useParams<"taskId">();
  // const dispatch = useAppDispatch();
  // const task = useAppSelector(state => state.task.selectedTask);
  // useEffect(() => {
  //   if (taskId) {
  //     dispatch(fetchTask(taskId));
  //   }
  // }, [taskId]);

  // if (!taskId) {
  //   return (<Navigate to="" />);
  // }
  // if (!task) {
  //   return (<div>Invalid task ID {taskId}</div>)
  // }
  
  // return (
  //   <div>TaskItem {task.description}</div>
  // );
  return <div>Task Item component.</div>;
}

export default TaskItem;