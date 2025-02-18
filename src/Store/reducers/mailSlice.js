import { createSlice } from "@reduxjs/toolkit";
const initialMailState={sentMailsList:{}, inboxMailsList: {}}

const mailSlice = createSlice({
  name: "mail",
  initialState: initialMailState,
  reducers:{
    addToSentMailList(state, action) {
        state.sentMailsList = {...action.payload}
    },
    addToInboxMailList(state, action) {
        state.inboxMailsList = {...action.payload}
    }
  }  
})

export default mailSlice.reducer
export const mailActions = mailSlice.actions;