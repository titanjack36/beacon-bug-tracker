import '../../styles/editable/PrioritySelect.scss';

type PrioritySelectProps = {
  selectedPriority: number;
  onSelectPriority(priority: number): void;
} & React.AllHTMLAttributes<HTMLDivElement>;

export default function PrioritySelect({
  selectedPriority,
  onSelectPriority,
  className='',
  ...props 
}: PrioritySelectProps) {
  return (
    <div className={`priority-select ${className}`} {...props}>
      {
        Array.from(Array(5).keys()).map(idx => {
          const priority = idx + 1;
          const isSelected = priority === selectedPriority;
          return (
            <button
                key={idx}
                className={`priority-item priority-${priority} ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectPriority(priority)}>
              {priority}
            </button>
          )
        })
      }
    </div>
  );
}
