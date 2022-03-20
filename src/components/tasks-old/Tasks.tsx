import { Navigate, Route, Routes } from 'react-router-dom';
import '../../styles/task/_index.scss';
import NoSelectedTask from './NoSelectedTask';
import TaskItem from './TaskItem';
import TaskList from './TaskList';

function Tasks() {
  return (
    <div className="tasks-page">
      <TaskList />
      <Routes>
        <Route path="/" element={<NoSelectedTask />} />
        <Route path="/:taskId/*" element={<TaskItem />} />
        <Route path="*" element={<Navigate to="" />} />
      </Routes>
    </div>
  );
}

export default Tasks;