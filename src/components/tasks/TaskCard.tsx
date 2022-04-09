import { useSearchParams } from "react-router-dom";
import { TaskSummary } from "../../models/task.type";
import '../../styles/task/_index.scss';
import ProfileLink from "../common/ProfileView";
import TagView from "./TagView";

type TaskCardProps = {
  task: TaskSummary
}

function TaskCard({ task }: TaskCardProps ) {
  let [searchParams, setSearchParams] = useSearchParams();
  
  const handleSelectTask = () => {
    const openTasks = new Set(searchParams.get('tasks')?.split(',') || []);
    openTasks.add(task.id);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tasks', Array.from(openTasks).join(','));
    setSearchParams(newSearchParams);
  };

  return (
    <div role="button" className="task-card" onClick={handleSelectTask}>
      <div className="top">
        <ProfileLink profile={task.assignedTo}/>
        <div className="title-section">
          <div className="h6 title" title={task.title}>{task.title}</div>
          <div className="subtitle">{task.id}</div>
        </div>
      </div>
      <div className="attr">
        <div className="attr-title subtitle">Type</div>
        <div className="attr-value">{task.type}</div>
      </div>
      <div className="attr">
        <div className="attr-title subtitle">Tags</div>
        <div className="attr-value">
          {
            task.tags.map(tag => <TagView key={tag.value} tag={tag} className="attr-value"/>)
          }
        </div>
      </div>
      <div className={`priority-bar show-priority-${task.priority}`}>
        {
          Array.from(Array(5).keys()).map(idx => (
            <div key={idx} className={`priority priority-${idx + 1}`}></div>
          ))
        }
      </div>
    </div>
  );
}

export default TaskCard;