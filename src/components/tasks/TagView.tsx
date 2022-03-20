import { Tag } from "../../models/task.type";

type TagViewProps = { tags: Tag[] } & React.AllHTMLAttributes<HTMLDivElement>;

function TagView({ tags, className, ...props }: TagViewProps) {
  return (
    <div {...props} className={`tag-view ${className}`} >
      {
        tags.map(tag => (
          <div key={tag.value} className={`tag ${tag.color}`}>{tag.value}</div>
        ))
      }
    </div>
  )
}

export default TagView;