import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SideViewState = {
  selectedTaskIdx: number;
  isProjectSelected: boolean;
  showProject: boolean;
};

const initialState: SideViewState = {
  selectedTaskIdx: 0,
  isProjectSelected: false,
  showProject: false
};

export const sideViewSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setSelectedTaskIdx: (state, action: PayloadAction<number>) => {
      state.selectedTaskIdx = action.payload;
      state.isProjectSelected = false;
    },
    selectProject: (state) => {
      state.isProjectSelected = true;
    },
    setShowProject: (state, action: PayloadAction<boolean>) => {
      state.showProject = action.payload;
      if (!state.showProject) {
        state.isProjectSelected = false;
      }
    }
  }
});

export const { setSelectedTaskIdx, selectProject, setShowProject } = sideViewSlice.actions;

export default sideViewSlice.reducer;
