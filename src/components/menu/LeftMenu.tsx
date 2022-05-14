import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/beacon-logo1.svg';
import { fetchProjectList } from '../../features/projectSlice';
import { useAppDispatch, useAppSelector } from '../../storeHooks';
import '../../styles/Menu.scss';
import { showErrorToast } from '../../utils/util';
import AddProjectModal from '../modals/AddProjectModal';

function LeftMenu() {
  const [isProjListLoading, setIsProjListLoading] = useState(true);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const loadProjectList = () => {
    dispatch(fetchProjectList()).unwrap()
      .then(() => setIsProjListLoading(false))
      .catch(_ => {
        showErrorToast(`Failed to load project list. Click to retry.`);
      });
  };

  useEffect(() => {
    loadProjectList();
  }, []);

  const projectList = useAppSelector(state => state.project.projectList);

  const handleAddProjectModalHide = (projectCreated: boolean) => {
    if (projectCreated) {
      loadProjectList();
    }
    setIsAddProjectModalOpen(false);
  }

  return (
    <div className="left-menu">
      <div className="logo-wrapper">
        <img className="logo" src={logo} alt="Beacon" />
      </div>
      <Link className="link" to="home">
        <span className="icon icon-home"/>
        Home
      </Link>
      <Link className="link" to="experts">
        <span className="icon icon-bulb"/>
        Experts
      </Link>
      <div className="heading">Projects</div>
      {
        isProjListLoading ? 
          <div>Loading ...</div> 
          :
          projectList.map(project => (
            <Link className="link" key={project.id} to={`projects/${project.id}`}>
              <span className="icon icon-folder"/>
              {project.name}
            </Link>
          ))
      }
      <button className="add-project-btn" onClick={() => setIsAddProjectModalOpen(true)}>
        <div className="icon-wrapper">
          <span className="icon icon-plus" />
        </div>
      </button>
      <AddProjectModal
        show={isAddProjectModalOpen}
        onHide={handleAddProjectModalHide}/>
    </div>
  );
}

export default LeftMenu;