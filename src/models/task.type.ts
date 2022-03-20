export type OpenTaskState = {
  taskId: string;
  state: 'loading' | 'loaded' | 'invalid';
};

export type TaskSummary = {
  id: string;
  title: string;
  assignedTo: Profile;
  createdBy: Profile;
  dateCreated: string;
  dateLastModified: string;
  sprint: string;
  priority: string;
  state: string;
  project: Project;
  type: string;
  tags: Tag[];
};

export type Task = TaskSummary & {
  description: string;
  comments: Comment[];
  parent?: TaskSummary;
  subtasks?: TaskSummary[];
};

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

export type Profile = {
  name: string;
  username: string;
  profileImageUrl: string;
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