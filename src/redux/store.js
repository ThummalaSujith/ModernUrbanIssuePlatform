import { configureStore } from "@reduxjs/toolkit";

import issueReducer from "./slices/issueSlice"

export const store =configureStore({
    reducer:{
     issues:issueReducer

    }
})