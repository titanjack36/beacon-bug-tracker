import { useState } from "react";
import TextEditor from "./TextEditor";
import '../../styles/AddComment.scss';
import Resizable, { ResizableConfig } from "./Resizable";

export default function AddComment() {
  const [newComment, setNewComment] = useState('');
  const [isWritingNewComment, setIsWritingNewComment] = useState(false);

  const resizableConfig: ResizableConfig = {
    initialHeight: isWritingNewComment ? '135px' : '60px',
    directions: isWritingNewComment ? ['north'] : []
  }
  
  const resizableStyle: React.CSSProperties = {
    minHeight: resizableConfig.initialHeight,
    maxHeight: '50%'
  };

  return (
    <Resizable config={resizableConfig} style={resizableStyle}>
      <div className={isWritingNewComment ? 'add-comment' : 'add-comment minimized'} >
        {
          !isWritingNewComment && <div className="profile"></div>
        }
        <TextEditor
            id="addComment"
            value={newComment}
            onChange={setNewComment}
            onClick={() => setIsWritingNewComment(true)} 
            placeholder="Add a comment"
            readOnly={false} />
        <div className="d-flex flex-column">
          <button className="btn btn-primary send-btn">
            <span className="icon icon-send"></span>
            Send
          </button>
          {
            isWritingNewComment &&
            <button className="btn btn-secondary" onClick={() => setIsWritingNewComment(false)}>
              Cancel
            </button>
          }
        </div>
      </div>
    </Resizable>
  );
}
