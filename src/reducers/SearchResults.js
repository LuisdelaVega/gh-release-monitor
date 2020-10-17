import { createSlice } from '@reduxjs/toolkit';

const searchResultsSlice = createSlice({
  name: 'searchResults',
  initialState: [],
  reducers: {
    clearSearchResults: () => [],
    setSearchResults: (state, { payload }) => payload,
    modifySearchResult: (state, { payload }) => {
      const { index, repo } = payload;
      const stateCopy = state.slice(0);
      stateCopy.splice(index, 1, repo);

      return stateCopy;
    },
  },
});

const { actions, reducer } = searchResultsSlice;

export const { setSearchResults, modifySearchResult, clearSearchResults } = actions;
export default reducer;
