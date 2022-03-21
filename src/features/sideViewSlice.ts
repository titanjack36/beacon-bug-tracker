import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchTaskResponse } from '../models/api.type';
import { OpenTaskState, TaskSummary } from '../models/task.type';
import { createGetRequest } from '../utils/api';

type SideViewState = {
  openTaskStates: OpenTaskState[];
  selectedTaskState?: OpenTaskState;
  isProjectSelected: boolean;
  showProject: boolean;
};

const initialState: SideViewState = {
  openTaskStates: [],
  selectedTaskState: undefined,
  isProjectSelected: false,
  showProject: false
};

export const fetchTasks = createGetRequest<FetchTaskResponse, { taskIds: string[] }>('task/fetchTask', 'task');

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
    selectProject: (state) => {
      state.isProjectSelected = true;
      state.selectedTaskState = undefined;
    },
    setShowProject: (state, action: PayloadAction<boolean>) => {
      state.showProject = action.payload;
      if (!state.showProject) {
        state.isProjectSelected = false;
      }
    }
  },
  extraReducers: builder => {
    builder
      // .addCase(fetchTaskList.fulfilled, (state, {payload}) => {
      //   state.taskList = payload;
      // })
      .addCase(fetchTasks.fulfilled, (state, {payload}) => {
        const {fetchedTasks, invalidTaskIds, errorTaskIds } = payload;
        const fetchedTaskMap = new Map(fetchedTasks.map(t => [t.id, t]));
        const invalidTaskIdSet = new Set(invalidTaskIds);
        const errorTaskIdSet = new Set(errorTaskIds);

        state.openTaskStates.forEach(taskState => {
          if (fetchedTaskMap.has(taskState.taskId)) {
            taskState.state = 'loaded';
            taskState.loadedTask = fetchedTaskMap.get(taskState.taskId);
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

export const { openTasks, selectTask, selectProject, setShowProject } = sideViewSlice.actions;

export default sideViewSlice.reducer;
