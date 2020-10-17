import { createSlice } from '@reduxjs/toolkit';

const TrackedReposSlice = createSlice({
  name: 'trackedRepos',
  initialState: [],
  reducers: {
    setTrackedRepos: (state, { payload }) => payload,
    addToTrackedRepos: (state, { payload: repo }) => {
      const stateCopy = state.slice(0);
      stateCopy.push(repo);

      return stateCopy;
    },
    updateTrackedRepo: (state, { payload }) => {
      const { index, repo } = payload;
      const stateCopy = state.slice(0);

      stateCopy.splice(index, 1, repo);

      return stateCopy;
    },
    removeFromTrackedRepos: (state, { payload: repo }) => {
      const stateCopy = state.slice(0);

      return stateCopy.reduce((accumulator, currentValue) => {
        if (currentValue.key !== repo.key) accumulator.push(currentValue);

        return accumulator;
      }, []);
    },
  },
});

const { actions, reducer } = TrackedReposSlice;

export const {
  setTrackedRepos,
  addToTrackedRepos,
  updateTrackedRepo,
  removeFromTrackedRepos,
} = actions;
export default reducer;
