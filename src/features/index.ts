import { combineReducers } from "@reduxjs/toolkit";
import projectSlice from "./projectSlice";
import sideViewSlice from "./sideViewSlice";
import taskSlice from "./taskSlice";
import userSlice from "./userSlice";

const rootReducer = combineReducers({
  user: userSlice,
  task: taskSlice,
  project: projectSlice,
  sideView: sideViewSlice
});

export default rootReducer;