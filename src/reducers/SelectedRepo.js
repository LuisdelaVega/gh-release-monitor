import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  key: undefined,
  details: {},
  latestRelease: {},
  commits: [],
  seen: true,
};

const repoSlice = createSlice({
  name: 'selectedRepo',
  initialState,
  reducers: {
    setSelectedRepo: (state, { payload: repo }) => repo,
    clearSelectedRepo: () => initialState,
  },
});

const { actions, reducer } = repoSlice;

export const { setSelectedRepo, clearSelectedRepo } = actions;
export default reducer;
