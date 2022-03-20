import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProjectBoard } from '../../features/projectSlice';
import { useAppDispatch, useAppSelector } from '../../storeHooks';
import { showErrorToast } from '../../utils/util';
import TaskCard from './TaskCard';

type TaskBoardProps = { 
  onLoad: () => void;
  onError: (projId: string, err: AxiosError) => void;
};

function TaskBoard({ onLoad, onError }: TaskBoardProps) {
  const disptach = useAppDispatch();
  const { projectId } = useParams<"projectId">();
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (projectId) {
      disptach(fetchProjectBoard({ id: projectId })).unwrap()
        .then(() => {
          onLoad();
          setIsLoading(false);
        })
        .catch((err: AxiosError) => onError(projectId, err));
    }
  }, [projectId]);

  const sprints = useAppSelector(state => state.project.selectedProject?.board);

  if (isLoading || !sprints) {
    return <div>Loading task board.</div>
  }

  return (
    <div className="task-board">
      <div className="header">
        <div className="header-item">Todo</div>
        <div className="header-item">In Progress</div>
        <div className="header-item">Testing</div>
        <div className="header-item">Approved</div>
      </div>
      {
        sprints.map(sprint => (
          <div className="sprint" key={sprint.sprintName}>
            <div className="sprint-name"><span className="icon icon-event" />{sprint.sprintName}</div>
            <div className="state-groups">
              {
                sprint.states.map(state => (
                  <div className="state" key={state.stateName}>
                    {
                      state.tasks.map(task => (
                        <TaskCard key={task.id} task={task}></TaskCard>
                      ))
                    }
                  </div>
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default TaskBoard;