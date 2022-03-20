import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../storeHooks';
import '../../styles/task/_index.scss';
import TaskCard from './TaskCard';
import TaskSearch from './TaskSearch';

function TaskList() {
  // const [searchParams] = useSearchParams();
  // const search = searchParams.get('search') ?? '';
  // const dispatch = useAppDispatch();
  // const taskList = useAppSelector(state => state.task.taskList);

  // useEffect(() => {
  //   dispatch(fetchTaskList(search));
  // }, [search]);

  // return (
  //   <div className="task-list">
  //     <div className="task-list-title h3">
  //       Tasks
  //     </div>
  //     <TaskSearch />
  //     {
  //       taskList.map(group => (
  //         <div key={group.groupName} className="task-group">
  //           <div className="h6 task-group-title">{group.groupName}</div>
  //           {
  //             group.tasks.map(task => (
  //               <TaskCard key={task.id} task={task}/>
  //             ))
  //           }
  //         </div>
  //       ))
  //     }
  //   </div>
  // );

  return <div>Task list component</div>;
}

export default TaskList;