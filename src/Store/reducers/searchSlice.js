import { createSlice } from "@reduxjs/toolkit";
const initialSearchState = { searchText: "" }

const searchSlice = createSlice({
  name: "search",
  initialState: initialSearchState,
  reducers: {
    setSearchText(state, action) {
      state.searchText = action.payload
    },
  },
});

export default searchSlice.reducer;
export const searchActions = searchSlice.actions;
