import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export function createGetRequest<ReturnType, PayloadType>(actionName: string, endpoint: string) {
  return createAsyncThunk<ReturnType, PayloadType, { rejectValue: AxiosError }>(actionName, async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/${endpoint}`, { params: payload });
      return response.data as ReturnType;
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(err);
    }
  });
}