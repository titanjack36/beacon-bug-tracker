import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { FetchTaskResponse } from "../models/api.type";
import { Task } from "../models/task.type";

export function createGetRequest<ReturnType, PayloadType>(actionName: string, endpoint: string) {
  return createAsyncThunk<ReturnType, PayloadType, { rejectValue: AxiosError }>(actionName, async (payload, { rejectWithValue }) => {
    try {
      return await makeGetRequest<ReturnType>(endpoint, payload);
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(err);
    }
  });
}

export async function makeGetRequest<ReturnType>(endpoint: string, params: any): Promise<ReturnType> {
  const response = await axios.get(`http://localhost:3001/api/v1/${endpoint}`, { params });
  return response.data as ReturnType;
}

export async function fetchTasks(taskIds: string[]): Promise<FetchTaskResponse> {
  return await makeGetRequest<FetchTaskResponse>('task', { taskIds });
}