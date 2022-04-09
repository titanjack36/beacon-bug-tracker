import { useState } from "react";
import TextEditor from "./TextEditor";
import '../../styles/AddComment.scss';
import Resizable, { ResizableConfig } from "./Resizable";
import { TextEditorState } from "../../models/edit.type";

type AddCommentProps = {
  newComment: TextEditorState;
  onStateUpdated(state: TextEditorState): void;
}

export default function AddComment({ newComment, onStateUpdated }: AddCommentProps) {

  const { isEditing } = newComment;

  const resizableConfig: ResizableConfig = {
    initialHeight: isEditing ? '135px' : '60px',
    directions: isEditing ? ['north'] : []
  }
  
  const resizableStyle: React.CSSProperties = {
    minHeight: resizableConfig.initialHeight,
    maxHeight: '50%'
  };

  return (
    <Resizable config={resizableConfig} style={resizableStyle}>
      <div className={isEditing ? 'add-comment' : 'add-comment minimized'} >
        {
          !isEditing && <div className="profile"></div>
        }
        <TextEditor
            id="addComment"
            state={newComment}
            onChange={onStateUpdated}
            placeholder="Add a comment"
            readOnly={false} />
        <div className="d-flex flex-column">
          <button className="btn btn-primary send-btn">
            <span className="icon icon-send"></span>
            Send
          </button>
          {
            isEditing &&
            <button
                className="btn btn-secondary"
                onClick={() => onStateUpdated({...newComment, isEditing: false})}>
              Cancel
            </button>
          }
        </div>
      </div>
    </Resizable>
  );
}
