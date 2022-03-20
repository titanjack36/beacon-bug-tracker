import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { TaskListItem } from "../../models/task.type";
import '../../styles/Tasks.scss'

type TaskCardProps = {
  task: TaskListItem
}

function TaskCard({ task }: TaskCardProps ) {
  const path = useResolvedPath(task.id);
  const match = useMatch({ path: path.pathname, end: true });

  return (
    <Link to={task.id} className={match ? "task-card active" : "task-card"}>
      <div className="task-card-body">
        <div className="top">
          <div className="profile"></div>
          <div className="title-section">
            <div className="h6 title" title={task.title}>{task.title}</div>
            <div className="subtitle">{task.id}</div>
          </div>
        </div>
        <div className="attr">
          <div className="attr-title subtitle">Type</div>
          <div className="attr-value">{task.attributes.type}</div>
        </div>
        <div className="attr">
          <div className="attr-title subtitle">State</div>
          <div className="attr-value">{task.attributes.state}</div>
        </div>
      </div>
    </Link>
  );
}

export default TaskCard;