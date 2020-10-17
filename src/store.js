import { configureStore } from '@reduxjs/toolkit';
import selectedRepo from './reducers/SelectedRepo';
import searchResults from './reducers/SearchResults';
import trackedRepos from './reducers/TrackedRepos';

export default function getStore() {
  return configureStore({
    reducer: {
      selectedRepo,
      searchResults,
      trackedRepos,
    },
  });
}
