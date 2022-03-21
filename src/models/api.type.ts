import { Task } from "./task.type";

export type FetchTaskResponse = {
  fetchedTasks: Task[],
  invalidTaskIds: string[],
  errorTaskIds: string[]
};