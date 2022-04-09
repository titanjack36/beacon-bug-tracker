import { createSlice } from '@reduxjs/toolkit';
import { Project } from '../models/project.type';
import { SprintGroup, TaskBoard } from '../models/task.type';
import { createGetRequest } from '../utils/api';

type ProjectState = {
  projectList: Project[];
  currentProject?: Project;
  currentBoard?: TaskBoard;
};

const initialState: ProjectState = {
  projectList: [],
  currentProject: undefined,
  currentBoard: undefined
};

export const fetchProjectList = createGetRequest<Project[], void>('project/fetchProjectList', '/project/all');
export const fetchProject = createGetRequest<Project, { id: string }>('project/fetchProject', '/project');
export const fetchProjectBoard = createGetRequest<TaskBoard, { id: string }>('project/fetchBoard', '/project/board');

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
        state.currentProject = payload;
      })
      .addCase(fetchProjectBoard.fulfilled, (state, {payload}) => {
        state.currentBoard = payload;
      })
  }
});

export default projectSlice.reducer;
