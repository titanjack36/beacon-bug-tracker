import { Task } from "./task.type";

export type TaskFetchResponse = {
  fetchedTasks: Task[],
  invalidTaskIds: string[]
};