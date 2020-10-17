import React, { useEffect } from 'react';
import Topbar from './Components/Topbar';
import { useDispatch, useSelector } from 'react-redux';
import LeftSidebar from './Components/LeftSidebar';
import Content from './Components/Content';
import { useIndexedDB } from 'react-indexed-db';
import { setTrackedRepos } from './reducers/TrackedRepos';
import { setSelectedRepo } from './reducers/SelectedRepo';

export const DrawerContext = React.createContext(250);

export default function Main() {
  const dispatch = useDispatch();
  const selectedRepo = useSelector((state) => state.selectedRepo);
  const searchResults = useSelector((state) => state.searchResults);

  const { getAll } = useIndexedDB('trackedRepos');

  useEffect(() => {
    getAll().then((trackedRepos) => {
      if (!searchResults.length && trackedRepos.length && !selectedRepo?.key) {
        dispatch(setTrackedRepos(trackedRepos));
        dispatch(setSelectedRepo(trackedRepos[0]));
      }
    });
  });

  return (
    <DrawerContext.Provider value={260}>
      <Topbar
        title={
          // Use optional chaining here for when the database is empty and there are no search results
          selectedRepo?.key
            ? `${selectedRepo.details.fullName} ${
                selectedRepo.latestRelease?.name ? `- ${selectedRepo.latestRelease.name}` : ''
              }`
            : `⬅️ You're not tracking any repos! Use the search bar to find some 😉`
        }
      />
      <LeftSidebar />
      <Content />
    </DrawerContext.Provider>
  );
}
