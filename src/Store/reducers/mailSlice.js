import { createSlice } from "@reduxjs/toolkit";
const initialMailState={mailsList:{}}

const mailSlice = createSlice({
  name: "mail",
  initialState: initialMailState,
  reducers:{
    addToMailList(state, action) {
        state.mailsList = {...action.payload}
    }
  }  
})

export default mailSlice.reducer
export const mailActions = mailSlice.actions;