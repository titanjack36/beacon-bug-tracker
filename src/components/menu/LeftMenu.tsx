import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/beacon-logo1.svg';
import { fetchProjectList } from '../../features/projectSlice';
import { useAppDispatch, useAppSelector } from '../../storeHooks';
import '../../styles/Menu.scss';
import { showErrorToast } from '../../utils/util';

function LeftMenu() {
  const [ isProjListLoading, setIsProjListLoading ] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProjectList()).unwrap()
    .then(() => setIsProjListLoading(false))
    .catch(_ => {
      showErrorToast(`Failed to load project list. Click to retry.`);
    });
  }, []);
  const projectList = useAppSelector(state => state.project.projectList);

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
    </div>
  );
}

export default LeftMenu;