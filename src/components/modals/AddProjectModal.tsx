import { AxiosError } from "axios";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import '../../styles/Modals.scss';
import { postCreateNewProject } from "../../utils/api";
import { showErrorToast } from "../../utils/util";

type AddProjectModalProps = {
  show: boolean;
  onHide(projectCreated: boolean): void;
};

type ValidationErrorMap = {
  [key: string]: string;
};


export default function AddProjectModal({ onHide, ...props }: AddProjectModalProps) {

  const [projectName, setProjectName] = useState<string>('');
  const [projectCode, setProjectCode] = useState<string>('');
  const [validationError, setValidationError] = useState<ValidationErrorMap>({});
 
  const handleCreateProject = () => {
    const newErrors: ValidationErrorMap = {};
    if (!projectName) {
      newErrors.projectName = 'Project name cannot be empty';
    }
    if (!projectCode) {
      newErrors.projectCode = 'Project code cannot be empty';
    }
    setValidationError(newErrors);
    if (Object.keys(newErrors).length) {
      return;
    }

    try {
      postCreateNewProject(projectName, projectCode);
      handleHide(true);
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.code === '400') {
        showErrorToast(`Failed to create project: ${axiosErr.message}`);
      } else {
        showErrorToast("Failed to create project, an error occured.");
      }
    }
  };

  const handleHide = (projectCreated=false) => {
    setProjectName('');
    setProjectCode('');
    setValidationError({});
    onHide(projectCreated);
  }
  
  return (
    <Modal
        onHide={() => handleHide()}
        className="theme-light"
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        {...props}>
      <Modal.Header closeButton className="add-project-modal-header">
        <Modal.Title id="contained-modal-title-vcenter">
          Create New Project
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="add-project-modal-body">
        <label>
          Project Name
          <input value={projectName} onChange={event => setProjectName(event.target.value)} />
          <span className="error">{validationError.projectName || ''}</span>
        </label>
        <label>
          Project Code
          <input value={projectCode} onChange={event => setProjectCode(event.target.value)} />
          <span className="error">{validationError.projectCode || ''}</span>
        </label>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleHide()}>Cancel</Button>
        <Button variant="primary" onClick={handleCreateProject}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
}
