import { User } from "@auth0/auth0-react";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { FetchTaskResponse } from "../models/api.type";
import { Tag, Task } from "../models/task.type";
import { Profile } from "../models/user.type";
import { API_URL, AUTH0_USERNAME_KEY } from "./constant";

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
    const response = await axios.get(API_URL + endpoint, { params });
    return response.data as ReturnType;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function makePostRequest<ReturnType>(endpoint: string, data: any, params?: any): Promise<ReturnType> {
  try {
    const response = await axios.post(API_URL + endpoint, data, { params });
    return response.data as ReturnType;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getMembers(projectId: string) {
  return await makeGetRequest<Profile[]>('/project/members', { projectId });
}

export async function getTags(projectId: string) {
  return await makeGetRequest<Tag[]>('/project/tags', { projectId });
}

export async function postLogin(user: User) {
  const postUser = {
    username: user[AUTH0_USERNAME_KEY],
    name: user.name,
    profileImageUrl: user.picture,
    projects: []
  };
  return await makePostRequest<string>('/user/login', postUser);
}

export async function postUpdateTask(task: Task) {
  return await makePostRequest<string>('/task/update', task);
}

export async function postPublishTask(task: Task) {
  return await makePostRequest<Task>('/task/publish', task);
}

export async function postCreateNewProject(projectName: string, projectId: string) {
  return await makePostRequest<string>('/project/create', {name: projectName, id: projectId});
}
