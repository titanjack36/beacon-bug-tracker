import { useEffect, useMemo, useRef, useState } from "react";
import '../../styles/editable/Select.scss';

export type SelectOption = {
  key: string,
  value?: any,
  content?: JSX.Element
}

type SelectProps = {
  options: SelectOption[];
  onSelectOption(option: SelectOption): void;
  onSelectClick?(event: React.MouseEvent<HTMLDivElement>): void;
  onSelectBlur?(hasSelectedProfile: boolean): void;
  alwaysEditing?: boolean;
  dropdownHeader?: JSX.Element;
} & React.AllHTMLAttributes<HTMLDivElement>;

export default function Select({ 
  options,
  onSelectOption,
  onSelectClick,
  onSelectBlur,
  alwaysEditing=false,
  dropdownHeader,
  className='',
  children,
  ...props
}: SelectProps) {
  const [isEditing, setIsEditing] = useState(alwaysEditing);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex(Math.min(selectedIndex, (options?.length || 1) - 1));
  }, [options]);

  useEffect(() => {
    if (!alwaysEditing) {
      handleSelectBlur(true);
    } else {
      setIsEditing(true);
    }
  }, [alwaysEditing]);

  const handleSelectClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    setIsEditing(true);
    setShowDropdown(true);
    onSelectClick && onSelectClick(event);
  };

  const handleSelectOption = (option: SelectOption, event?: React.MouseEvent) => {
    event?.stopPropagation();
    onSelectOption(option);
    handleSelectBlur(true);
  }

  const handleSelectBlur = (hasSelectedProfile: boolean) => {
    onSelectBlur && onSelectBlur(hasSelectedProfile);
    setShowDropdown(false);
    if (!alwaysEditing) {
      setIsEditing(false);
    }
  };

  const handleDocumentClick = (event: MouseEvent) => {
    if(isEditing && !selectRef.current?.contains(event.target as Node)) {
      handleSelectBlur(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        if (options?.length) {
          handleSelectOption(options[selectedIndex]);
        }
        break;
      case 'Escape':
        handleSelectBlur(false);
        break;
      case 'ArrowUp':
        if (options?.length) {
          event.preventDefault();
          const nextIndex = (selectedIndex ? selectedIndex : options.length) - 1;
          setSelectedIndex(nextIndex);
        }
        break;
      case 'ArrowDown':
        if (options?.length) {
          event.preventDefault();
          const nextIndex = (selectedIndex + 1) % options.length;
          setSelectedIndex(nextIndex);
        }
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [isEditing, alwaysEditing]);

  return (
    <div
        role="button"
        ref={selectRef}
        className={`select-component ${isEditing ? 'editing' : ''} ${className}`}
        onClick={handleSelectClick}
        onKeyDown={handleKeyPress}
        tabIndex={0}
        {...props}
        >
      <div className="select-content">
        { children }
        {
          showDropdown && options && (
            <div className="select-dropdown">
              {
                dropdownHeader
              }
              {
                options.map((option, index) => (
                  <button
                      key={option.key}
                      className={`item ${index === selectedIndex ? 'selected' : ''}`}
                      onClick={(event) => handleSelectOption(option, event)} >
                    {option.content || option.value || option.key}
                  </button>
                ))
              }
            </div>
          )
        }
      </div>
    </div>
  );
}
