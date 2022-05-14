import { SprintGroup, Tag } from "./task.type";
import { Profile } from "./user.type";

export type Project = {
  name: string;
  id: string;
  members?: Profile[];
  tags?: Tag[];
  board?: SprintGroup[];
}