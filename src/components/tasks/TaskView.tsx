import { useState } from "react";
import { Task } from "../../models/task.type";
import TextEditor from "../common/TextEditor";
import TagView from "./TagView";
import '../../styles/task/_index.scss';
import AddComment from "../common/AddComment";
import ProfileLink from "../common/ProfileView";

type TaskViewProps = { task: Task };

function TaskView({ task }: TaskViewProps) {
  const [description, setDescription] = useState(task.description);

  return (
    <div className="task-view">
      <div className="header">
        <div className="title">{task.title}</div>
        <div className="breadcrumbs">
          <span className="crumb">{task.project.name}</span>
          <span className="icon icon-chevron_right"></span>
          <span className="crumb">{task.sprint}</span>
          <span className="icon icon-chevron_right"></span>
          {
            !!task.parent && ([
                <span className="crumb">{task.parent.id}</span>,
                <span className="icon icon-chevron_right"></span>
            ])
          }
          <span className="crumb">{task.id}</span>
        </div>
      </div>

      <div className="body">
        <div className="info">
          <div className="item">
            <div className="label">Assigned to</div>
            <ProfileLink className="text" profile={task.assignedTo} showName={true}/>
          </div>
          <div className="item">
            <div className="label">Created by</div>
            <ProfileLink className="text" profile={task.createdBy} showName={true}/>
          </div>
          <div className="item">
            <div className="label">State</div>
            <div className="text">{task.state}</div>
          </div>
          <div className="item">
            <div className="label">Priority</div>
            <div className="text">{task.priority}</div>
          </div>
          <div className="item">
            <div className="label">Type</div>
            <div className="text">{task.type}</div>
          </div>
          <div className="item">
            <div className="label">Tags</div>
            <TagView tags={task.tags} className="text"/>
          </div>
        </div>

        <div className="description">
          <div className="label"><span className="icon icon-notes"/>Description</div>
          <TextEditor id="descriptionEditor" value={description} onChange={setDescription} readOnly={true}/>
        </div>

        <div className="comments">
          <div className="label"><span className="icon icon-comments"/>Comments</div>
        </div>
      </div>
      <AddComment />
    </div>
  );
}

export default TaskView;