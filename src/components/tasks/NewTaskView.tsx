import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { TextEditorState } from '../../models/edit.type';
import { Project, Tag, Task } from '../../models/task.type';
import { Profile } from '../../models/user.type';
import { postPublishTask } from '../../utils/api';
import { AUTH0_USERNAME_KEY } from '../../utils/constant';
import { showErrorToast } from '../../utils/util';
import TextEditor from '../common/TextEditor';
import PrioritySelect from '../editable/PrioritySelect';
import ProfileSelect from '../editable/ProfileSelect';
import Select from '../editable/Select';
import TagSelect from '../editable/TagSelect';
import TextField from '../editable/TextField'
import { stateSelectOptions, typeSelectOptions } from './TaskView';

type NewTaskViewProps = {
  project: Project;
  onTitleChange(title: string): void;
  onPublishTask(task: Task): void;
};

type ValidationErrorMap = {
  [key: string]: string;
};

const taskDraft = {
  title: '',
  assignedTo: null,
  state: null,
  type: null,
  priority: null,
  tags: [] as Tag[]
} as Task;

const initDescription: TextEditorState = {
  value: '',
  isEditing: true
};

export default function NewTaskView({ project, onTitleChange, onPublishTask }: NewTaskViewProps) {
  const { user } = useAuth0();
  const createdBy = {
    name: user?.name,
    username: user && user[AUTH0_USERNAME_KEY],
    profileImageUrl: user?.picture
  } as Profile;
  
  const [task, setTask] = useState({ ...taskDraft, project, createdBy });
  const [description, setDescription] = useState(initDescription);
  const [validationErrors, setValidationErrors] = useState<ValidationErrorMap>({});

  const handleTitleChange = (title: string) => {
    onTitleChange(title);
    setTask({ ...task, title });
  };

  const handlePublishTask = async () => {
    const newErrors: ValidationErrorMap = {};
    if (!task.title.length) {
      newErrors.title = 'Title cannot be empty.';
    }
    if (task.priority === null) {
      newErrors.priority = 'Priority cannot be empty.';
    }
    if (task.state === null) {
      newErrors.state = 'State cannot be empty.';
    }
    setValidationErrors(newErrors);
    if (Object.keys(newErrors).length) {
      return;
    }

    try {
      const publishedTask = await postPublishTask(task);
      onPublishTask(publishedTask);
    } catch (err) {
      showErrorToast(
        "Failed to publish task. Click to retry.",
        () => handlePublishTask()
      );
    }
  }

  return (
    <div className="task-view new-task">
      <div className="header">
        <div className="title-section">
          <TextField className="title" value={task.title} onChange={handleTitleChange} alwaysEditing={true} />
          <div className="field-error">{validationErrors.title}</div>
        </div>
        <div className="action-section">
          <button className="btn btn-primary publish" onClick={handlePublishTask}>
            <span className="icon icon-publish"></span>
          </button>
        </div>
      </div>

      <div className="body">
        <div className="info-section">
          <div className="info-section-item">
            <div className="label">Assigned to</div>
            <ProfileSelect 
                className="field"
                selectedProfile={task.assignedTo}
                projectId={project.id}
                onSelectProfile={(assignedTo) => setTask({ ...task, assignedTo })}
                alwaysEditing={true}/>
          </div>
          <div className="info-section-item">
            <div className="label">State</div>
            <Select
                className="field"
                options={stateSelectOptions}
                onSelectOption={({key}) => setTask({ ...task, state: key })}
                alwaysEditing={true}>
              <div className="field-selected">{task.state}</div>
            </Select>
            <div className="field-error">{validationErrors.state}</div>
          </div>
          <div className="info-section-item">
            <div className="label">Priority</div>
            <PrioritySelect className="field"
                selectedPriority={task.priority}
                onSelectPriority={(priority) => setTask({ ...task, priority })}
                />
            <div className="field-error">{validationErrors.priority}</div>
          </div>
          <div className="info-section-item">
            <div className="label">Type</div>
            <Select
                className="field"
                options={typeSelectOptions}
                onSelectOption={({key}) => setTask({ ...task, type: key })}
                alwaysEditing={true}>
              <div className="field-selected">{task.type}</div>
            </Select>
          </div>
          <div className="info-section-item">
            <div className="label">Tags</div>
            <TagSelect
                className="field"
                projectId={project.id}
                selectedTags={task.tags}
                onSelectedTagsChange={tags => setTask({ ...task, tags })}
                alwaysEditing={true}/>
          </div>
        </div>

        <div className="description">
          <div className="label"><span className="icon icon-notes"/>Description</div>
          <TextEditor
              id="descriptionEditor"
              state={description}
              onChange={setDescription} />
        </div>
      </div>
    </div>
  );
}
