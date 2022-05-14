import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchTaskResponse } from '../models/api.type';
import { OpenTaskState, Project } from '../models/task.type';
import { createGetRequest } from '../utils/api';

type SideViewState = {
  openTaskStates: OpenTaskState[];
  selectedTaskState?: OpenTaskState;
  isProjectSelected: boolean;
};

const initialState: SideViewState = {
  openTaskStates: [],
  selectedTaskState: undefined,
  isProjectSelected: false
};

export const fetchTasks = createGetRequest<FetchTaskResponse, { taskIds: string[] }>('task/fetchTask', '/task');

export const sideViewSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    openTasks: (state, action: PayloadAction<string[]>) => {
      const openTaskStateSet = new Set(state.openTaskStates.map(s => s.taskId));
      // const newTaskStates: OpenTaskState[] = [];
      action.payload.forEach(newTaskId => {
        if (!openTaskStateSet.has(newTaskId)) {
          state.openTaskStates.push({ taskId: newTaskId, state: 'loading' });
        }
      });
      // if (newTaskStates.length) {
      //   state.selectedTaskState = newTaskStates[0];
      //   state.openTaskStates = state.openTaskStates.concat(newTaskStates);
      // }
    },
    selectTask: (state, action: PayloadAction<string>) => {
      state.selectedTaskState = state.openTaskStates.find(s => s.taskId === action.payload);
      state.isProjectSelected = false;
    },
    closeTask: (state, action: PayloadAction<string>) => {
      const openTaskStates = state.openTaskStates;
      const closedTaskId = action.payload;
      const closedTaskIdx = openTaskStates.findIndex(s => s.taskId === closedTaskId);
      if (closedTaskId === state.selectedTaskState?.taskId) {
        if (closedTaskIdx > 0) {
          state.selectedTaskState = openTaskStates[closedTaskIdx - 1];
        } else if (openTaskStates.length > 2) {
          state.selectedTaskState = openTaskStates[1];
        } else {
          state.selectedTaskState = undefined;
        }
      }
      openTaskStates.splice(closedTaskIdx, 1);
    },
    updateTaskState: (state, action: PayloadAction<OpenTaskState>) => {
      const newTaskState = action.payload;
      const newTaskId = newTaskState.loadedTask ? newTaskState.loadedTask.id : newTaskState.taskId;
      const idx = state.openTaskStates.findIndex(s => s.taskId === newTaskState.taskId);
      if (idx >= 0) {
        state.openTaskStates[idx] = newTaskState;
        if (newTaskState.taskId === state.selectedTaskState?.taskId) {
          state.selectedTaskState = state.openTaskStates[idx];
          state.selectedTaskState.taskId = newTaskId;
        }
        state.openTaskStates[idx].taskId = newTaskId;
      }
    },
    selectProject: (state) => {
      state.isProjectSelected = true;
      state.selectedTaskState = undefined;
    },
    createNewTask: (state, action: PayloadAction<Project>) => {
      const newTask = {
        taskId: '_DRAFT-1',
        project: action.payload,
        taskTitle: '',
        state: 'draft'
      } as OpenTaskState;
      state.openTaskStates.push(newTask);
      state.selectedTaskState = newTask;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.fulfilled, (state, {payload}) => {
        const {fetchedTasks, invalidTaskIds, errorTaskIds } = payload;
        const fetchedTaskMap = new Map(fetchedTasks.map(t => [t.id, t]));
        const invalidTaskIdSet = new Set(invalidTaskIds);
        const errorTaskIdSet = new Set(errorTaskIds);

        state.openTaskStates.forEach(taskState => {
          if (fetchedTaskMap.has(taskState.taskId)) {
            const loadedTask = fetchedTaskMap.get(taskState.taskId);
            taskState.project = loadedTask!.project;
            taskState.state = 'loaded';
            taskState.taskTitle = loadedTask!.title;
            taskState.loadedTask = loadedTask;
            taskState.editState = {
              description: { value: loadedTask!.description, isEditing: false },
              newComment: { value: '', isEditing: false },
              isModified: false
            };
          } else if (invalidTaskIdSet.has(taskState.taskId)) {
            taskState.state = 'invalid';
          } else if (errorTaskIdSet.has(taskState.taskId)) {
            taskState.state = 'error';
          }
          if (state.selectedTaskState?.taskId === taskState.taskId) {
            state.selectedTaskState = taskState;
          }
        });
      });
  }
});

export const { openTasks, selectTask, updateTaskState, selectProject, createNewTask } = sideViewSlice.actions;

export default sideViewSlice.reducer;
