import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../styles/TextEditor.scss';

const icons = ReactQuill.Quill.import('ui/icons');
icons['code-block'] = '<span class="icon icon-code-block"></span>';

type TextEditorProps = { 
  id: string;
  value?: string;
  onChange?(value: string): void;
  onClick?(): void;
  placeholder?: string;
  readOnly?: boolean;
} & Omit<React.AllHTMLAttributes<HTMLDivElement>, 'onChange'>;

export default function TextEditor({ id, value, onChange, onClick, placeholder, readOnly, className, ...props }: TextEditorProps) {
  const toolbarId = `${id}-toolbar`;
  const quillModules = { toolbar: `#${toolbarId}` };

  return (
    <div id={id} className={`text-editor ${readOnly ? 'read-only' : ''} ${className || ''}`} {...props}
        onClick={onClick}>
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
      <ReactQuill theme="snow" value={value} onChange={onChange}
          placeholder={placeholder} readOnly={readOnly} modules={quillModules} />
    </div>
  )
}
