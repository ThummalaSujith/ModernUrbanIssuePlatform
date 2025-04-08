import { configureStore } from "@reduxjs/toolkit";

import issueReducer from "../redux/slices/issueSlice"

export const store =configureStore({
    reducer:{
     issues:issueReducer

    }
})