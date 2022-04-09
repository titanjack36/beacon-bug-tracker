import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { FetchTaskResponse } from "../models/api.type";
import { Profile, Tag, Task } from "../models/task.type";

const apiUrl = `http://localhost:3001/api/v1`;

export function createGetRequest<ReturnType, PayloadType>(actionName: string, endpoint: string) {
  return createAsyncThunk<ReturnType, PayloadType, { rejectValue: AxiosError }>(actionName, async (payload, { rejectWithValue }) => {
    try {
      return await makeGetRequest<ReturnType>(endpoint, payload);
    } catch (err: any) {
      return rejectWithValue(err);
    }
  });
}

export async function makeGetRequest<ReturnType>(endpoint: string, params?: any): Promise<ReturnType> {
  try {
    const response = await axios.get(apiUrl + endpoint, { params });
    return response.data as ReturnType;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function makePostRequest<ReturnType>(endpoint: string, data: any, params?: any): Promise<ReturnType> {
  try {
    const response = await axios.post(apiUrl + endpoint, data, { params });
    return response.data as ReturnType;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function fetchMembers(projectId: string) {
  return await makeGetRequest<Profile[]>('/project/members', { projectId });
}

export async function fetchTags(projectId: string) {
  return await makeGetRequest<Tag[]>('/project/tags', { projectId });
}

export async function updateTask(task: Task) {
  return await makePostRequest<string>('/task', task);
}