import { TextEditorState } from "./edit.type";
import { Profile } from "./user.type";

export type OpenTaskState = {
  taskId: string;
  project?: Project;
  state: 'loading' | 'loaded' | 'invalid' | 'error' | 'draft';
  taskTitle?: string;
  loadedTask?: Task;
  editState?: TaskEditState;
};

export type TaskSummary = {
  id: string;
  title: string;
  assignedTo: Profile | null;
  createdBy: Profile;
  dateCreated: string;
  dateLastModified: string;
  sprint: string;
  priority: number | null;
  state: string | null;
  project: Project;
  type: string | null;
  tags: Tag[];
};

export type Task = TaskSummary & {
  description: string;
  comments: Comment[];
  parent?: TaskSummary;
  subtasks?: TaskSummary[];
};

export type TaskBoard = {
  projectId: string;
  sprints: SprintGroup[];
}

export type SprintGroup = {
  sprintName: string;
  states: StateGroup[];
};

export type StateGroup = {
  stateName: string;
  tasks: TaskSummary[];
};

export type Project = {
  id: string;
  name: string;
};

export type Comment = {
  createdBy: Profile;
  body: string;
};

export type Tag = {
  value: string;
  color: string;
};


export type TaskListItem = {
  id: string;
  title: string;
  attributes: TaskSummary;
};

export type TaskListGroup = {
  groupName: string;
  tasks: TaskListItem[];
};


export type UpdatedTaskSummary = Omit<
  Partial<TaskSummary>, 
  'id' | 'createdBy' | 'dateCreated' | 'dateLastModified'
>;

export type TaskEditState = {
  description: TextEditorState;
  newComment: TextEditorState;
  isModified: boolean;
};