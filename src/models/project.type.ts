import { SprintGroup } from "./task.type";

export type Project = {
  name: string;
  id: string;
  board?: SprintGroup[];
}