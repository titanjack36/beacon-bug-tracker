import { useEffect, useState } from "react";
import '../../styles/editable/TextField.scss';

type TextFieldProps = {
  value: string;
  onChange(value: string): void;
  className?: string;
  alwaysEditing?: boolean;
};

export default function TextField({ value, onChange, alwaysEditing=false, className='' }: TextFieldProps) {
  const [isEditing, setIsEditing] = useState(alwaysEditing);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
    if (isEditing && !alwaysEditing) {
      handleFinishEditing();
    }
    setIsEditing(isEditing);
  }, [value, alwaysEditing]);

  const handleFinishEditing = () => {
    onChange(editValue);
    if (!alwaysEditing) {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
          autoFocus
          className={`text-field-input ${className}`}
          value={editValue}
          onChange={event => setEditValue(event.target.value)}
          onBlur={() => handleFinishEditing()}/>
    );
  } else {
    return (
      <div
          role="button"
          aria-label="Edit title"
          className={`text-field-view ${className}`}
          onClick={() => setIsEditing(true)}>
        {editValue}
      </div>
    );
  }
};
