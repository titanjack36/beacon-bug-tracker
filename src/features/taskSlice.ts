import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OpenTaskState, Task } from '../models/task.type';
import { createGetRequest } from '../utils/api';
import { TaskFetchResponse } from '../models/api.type';

type TaskState = {
  loadedTasks: Task[];
  openTaskStates: OpenTaskState[];
};

const initialState: TaskState = {
  loadedTasks: [],
  openTaskStates: []
};

// export const fetchTaskList = createAsyncThunk('task/fetchTaskList', async (search: string) => {
//   const res = axios.get('http://localhost:3001/api/v1/task/tasklist', { params: { search }});
//   const { data } = await res;
//   return data as TaskListGroup[];
// });

// export const fetchTask = createAsyncThunk('task/fetchTask', async (id: string) => {
//   const res = axios.get('http://localhost:3001/api/v1/task', { params: { id }});
//   const { data } = await res;
//   return data as Task;
// });

export const fetchTasks = createGetRequest<TaskFetchResponse, { ids: string[] }>('task/fetchTask', 'task');

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    closeTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      if (!taskId) {
        return;
      }
      state.loadedTasks = state.loadedTasks.filter(t => t.id !== taskId);
      state.openTaskStates = state.openTaskStates.filter(s => s.taskId !== taskId);
    },
    setOpenTasks: (state, action: PayloadAction<string[]>) => {
      const openTaskIds = action.payload;
      const existingTaskStates = state.openTaskStates.filter(s => s.state === 'loaded');
      const newTaskIdSet = new Set(existingTaskStates.map(s => s.taskId));
      const newTaskStates: OpenTaskState[] = [];
      openTaskIds.forEach(id => {
        if (!newTaskIdSet.has(id)) {
          newTaskIdSet.add(id);
          newTaskStates.push({ taskId: id, state: 'loading' });
        }
      });
      state.openTaskStates = existingTaskStates.concat(newTaskStates);
    }
  },
  extraReducers: builder => {
    builder
      // .addCase(fetchTaskList.fulfilled, (state, {payload}) => {
      //   state.taskList = payload;
      // })
      .addCase(fetchTasks.fulfilled, (state, {payload}) => {
        const loadedTaskMap = new Map(state.loadedTasks.map(t => [t.id, t]));
        payload.fetchedTasks.forEach(t => loadedTaskMap.set(t.id, t));
        state.loadedTasks = Array.from(loadedTaskMap.values());

        const loadedTaskIds = new Set(payload.fetchedTasks.map(t => t.id));
        const invalidTaskIds = new Set(payload.invalidTaskIds);
        state.openTaskStates.forEach(taskState => {
          if (loadedTaskIds.has(taskState.taskId)) {
            taskState.state = 'loaded';
          } else if (invalidTaskIds.has(taskState.taskId)) {
            taskState.state = 'invalid';
          }
        });
      });
  }
});

export const { closeTask, setOpenTasks } = taskSlice.actions;

export default taskSlice.reducer;
