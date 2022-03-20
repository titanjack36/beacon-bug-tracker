import { createSlice } from '@reduxjs/toolkit';
import { Project } from '../models/project.type';
import { SprintGroup } from '../models/task.type';
import { createGetRequest } from '../utils/api';

type ProjectState = {
  projectList: Project[];
  selectedProject?: Project;
};

const initialState: ProjectState = {
  projectList: [],
  selectedProject: undefined
};

export const fetchProjectList = createGetRequest<Project[], void>('project/fetchProjectList', 'project/all');
export const fetchProject = createGetRequest<Project, { id: string }>('project/fetchProject', 'project');
export const fetchProjectBoard = createGetRequest<Project, { id: string }>('project/fetchBoard', 'project/board');

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProjectList.fulfilled, (state, {payload}) => {
        state.projectList = payload;
      })
      .addCase(fetchProject.fulfilled, (state, {payload}) => {
        state.selectedProject = payload;
      })
      .addCase(fetchProjectBoard.fulfilled, (state, {payload}) => {
        state.selectedProject = payload;
      })
  }
});

export default projectSlice.reducer;
