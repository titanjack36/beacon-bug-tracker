import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { TextEditorState } from '../../models/edit.type';
import '../../styles/TextEditor.scss';
import { useStateRef } from '../../utils/util';

const icons = ReactQuill.Quill.import('ui/icons');
icons['code-block'] = '<span class="icon icon-code-block"></span>';

type TextEditorProps = { 
  id: string;
  state: TextEditorState;
  onChange(state: TextEditorState): void;
  placeholder?: string;
} & Omit<React.AllHTMLAttributes<HTMLDivElement>, 'onChange'>;

export default function TextEditor({ id, state, onChange, placeholder, className, ...props }: TextEditorProps) {
  const toolbarId = `${id}-toolbar`;
  const quillModules = { toolbar: `#${toolbarId}` };

  const [localState, setLocalState, localStateRef] = useStateRef(state);
  const readOnly = !localState.isEditing;

  useEffect(() => setLocalState(state), [state]);

  // console.log('texteditor', state);

  const handleClick = () => {
    // localState.current = { ...localState.current, isEditing: true };
    setLocalState((prevState) => ({ ...prevState, isEditing: true }));
    onChange({ ...localStateRef.current, isEditing: true });
  };

  const handleEdit = (value: string) => {
    if (value !== localStateRef.current.value) {
      // localState.current = { ...localState.current, value };
      console.log('handleedit', value)
      setLocalState((prevState) => ({ ...prevState, value }));
      onChange({ ...localStateRef.current, value });
    }
  }

  return (
    <div id={id} className={`text-editor ${readOnly ? 'read-only' : ''} ${className || ''}`} {...props}
        onClick={handleClick}>
      <div id={toolbarId} className="toolbar">
        <span className="ql-formats">
          <select className="ql-header" />
        </span>
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-code" />
          <button className="ql-script" value="sub" />
          <button className="ql-script" value="super" />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
          <select className="ql-align" />
        </span>
        <span className="ql-formats">
          <button className="ql-blockquote" />
          <button className="ql-code-block" />
        </span>
        <span className="ql-formats">
          <button className="ql-link" />
          <button className="ql-image" />
          <button className="ql-video" />
        </span>
      </div>
      <ReactQuill theme="snow" value={localState.value} onChange={handleEdit}
          placeholder={placeholder} readOnly={readOnly} modules={quillModules} />
    </div>
  )
}
