import React from "react";
import { Tag } from "../../models/task.type";

type TagViewProps = {
  tag: Tag;
  onDelete?(event: React.MouseEvent): void;
} & React.AllHTMLAttributes<HTMLDivElement>;

function TagView({ tag, onDelete }: TagViewProps) {
  return (
    <div key={tag.value} className={`tag ${tag.color}`}>
      {tag.value}
      {
        onDelete && <button className="close-tag" onClick={(event) => onDelete(event)}>
          <span className="icon icon-close"/>
        </button>
      }
    </div>
  );
}

export default TagView;