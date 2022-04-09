import { useEffect, useRef, useState } from "react";
import { TaskEditState, Task } from "../../models/task.type";
import TextEditor from "../common/TextEditor";
import TagView from "./TagView";
import '../../styles/task/_index.scss';
import AddComment from "../common/AddComment";
import ProfileSelect from "../editable/ProfileSelect";
import ProfileView from "../common/ProfileView";
import Select, { SelectOption } from "../editable/Select";
import { DeepPartial } from "../../models/extended.type";
import { showErrorToast } from "../../utils/util";
import { updateTask } from "../../utils/api";
import PrioritySelect from "../editable/PrioritySelect";
import TagSelect from "../editable/TagSelect";


type TaskViewProps = {
  task: Task;
  state: TaskEditState;
  onStateUpdated(state: DeepPartial<TaskEditState>): void;
  onTaskUpdated(task: Task): void;
};

const stateSelectOptions: SelectOption[] = [
  { key: 'Todo' },
  { key: 'In Progress' },
  { key: 'Testing' },
  { key: 'Approved'}
];

const typeSelectOptions: SelectOption[] = [
  { key: 'Bug' },
  { key: 'Task' }
];


function TaskView({ task, state, onStateUpdated, onTaskUpdated }: TaskViewProps) {
  const { description, newComment, isModified } = state;

  // console.log('taskview', state);

  const handleTaskChange = async (updatedTask: Task): Promise<boolean> => {
    onTaskUpdated(updatedTask);
    try {
      await updateTask(updatedTask);
      return true;
    } catch (err) {
      showErrorToast(
        "Failed to update task. Click to retry.",
        () => handleTaskChange(updatedTask)
      );
      return false;
    }
  };

  const handleStateUpdated = (newState: Partial<TaskEditState>) => {
    onStateUpdated({
      description: newState.description || state.description,
      newComment: newState.newComment || state.newComment,
      isModified: newState.isModified ?? (
        state.isModified || 
        !!newState?.description?.isEditing || 
        !!newState?.newComment?.isEditing
      )
    });
  };

  const handleSaveDescription = async () => {
    handleStateUpdated({
      description: { ...description, isEditing: false },
      isModified: false
    });
    const success = await handleTaskChange({ ...task, description: description.value });
    if (!success) {
      handleStateUpdated({
        description: { ...description, isEditing: true },
        isModified: true
      });
    }
  };

  const handleCancelDescription = async () => {
    handleStateUpdated({
      description: { value: task.description, isEditing: false },
      isModified: false
    });
  }

  return (
    <div className="task-view">
      <div className="header">
        <div className="title-section">
        <div className="title">{task.title}</div>
          <div className="breadcrumbs">
            <span className="crumb">{task.project.name}</span>
            <span className="icon icon-chevron-right"></span>
            <span className="crumb">{task.sprint}</span>
            <span className="icon icon-chevron-right"></span>
            {
              !!task.parent && ([
                  <span className="crumb">{task.parent.id}</span>,
                  <span className="icon icon-chevron-right"></span>
              ])
            }
            <span className="crumb">{task.id}</span>
          </div>
        </div>
        <div className="action-section">
          {
            isModified && (
              <div className="modified-actions">
                <button className="btn btn-secondary cancel" onClick={handleCancelDescription}>
                  <span className="icon icon-close"></span>
                </button>
                <button className="btn btn-primary save" onClick={handleSaveDescription}>
                  <span className="icon icon-save"></span>
                </button>
              </div>
            )
          }
        </div>
      </div>

      <div className="body">
        <div className="info-section">
          <div className="info-section-item">
            <div className="label">Assigned to</div>
            <ProfileSelect 
                className="field"
                selectedProfile={task.assignedTo}
                projectId={task.project.id}
                onSelectProfile={(assignedTo) => handleTaskChange({ ...task, assignedTo })}/>
          </div>
          <div className="info-section-item">
            <div className="label">Created by</div>
            <ProfileView className="field disabled" profile={task.createdBy} showName={true}/>
          </div>
          <div className="info-section-item">
            <div className="label">State</div>
            <Select
                className="field"
                options={stateSelectOptions}
                onSelectOption={({key}) => handleTaskChange({ ...task, state: key })}>
              <div className="field-selected">{task.state}</div>
            </Select>
          </div>
          <div className="info-section-item">
            <div className="label">Priority</div>
            <PrioritySelect className="field"
                selectedPriority={task.priority}
                onSelectPriority={(priority) => handleTaskChange({ ...task, priority })}/>
          </div>
          <div className="info-section-item">
            <div className="label">Type</div>
            <Select
                className="field"
                options={typeSelectOptions}
                onSelectOption={({key}) => handleTaskChange({ ...task, type: key })}>
              <div className="field-selected">{task.type}</div>
            </Select>
          </div>
          <div className="info-section-item">
            <div className="label">Tags</div>
            <TagSelect
                className="field"
                projectId={task.project.id}
                selectedTags={task.tags}
                onSelectedTagsChange={tags => handleTaskChange({ ...task, tags })}/>
          </div>
        </div>

        <div className="description">
          <div className="label"><span className="icon icon-notes"/>Description</div>
          <TextEditor
              id="descriptionEditor"
              state={description}
              onChange={(state) => handleStateUpdated({ description: state })}
              />
        </div>

        <div className="comments">
          <div className="label"><span className="icon icon-comments"/>Comments</div>
        </div>
      </div>
      <AddComment
          newComment={newComment}
          onStateUpdated={(state) => handleStateUpdated({ newComment: state })} />
    </div>
  );
}

export default TaskView;