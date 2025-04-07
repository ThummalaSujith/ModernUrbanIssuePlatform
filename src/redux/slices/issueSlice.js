import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {fetchIssues} from "../../services/getissueService";


// createSlice: helps you create a Redux slice easily (state + reducers)
// createAsyncThunk: helps with async actions, like calling an API.

export const getIssues = createAsyncThunk("issues/getissues", async () => {
  const data = await fetchIssues();
  return data;
});

const issueSlice = createSlice({
  name: "issues",
  initialState: {
    data: [], // Stores the array of issues
    loading: false,
    error: null,
  },

  reducers: {
    addIssue: (state, action) => {
      state.data.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      // 1. When fetch starts
      .addCase(getIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })

      .addCase(getIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export default issueSlice.reducer