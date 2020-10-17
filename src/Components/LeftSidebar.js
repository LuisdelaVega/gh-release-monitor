import React, { Fragment, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Drawer, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { getLatestActivityForRepo } from '../api/octokitRequests';
import { setSelectedRepo } from '../reducers/SelectedRepo';
import { modifySearchResult } from '../reducers/SearchResults';
import SearchBar from './SearchBar';
import { DrawerContext } from '../Main';
import RefreshButton from './RefreshButton';
import { checkIfRepoIsBeingTracked } from '../helpers';
import { useIndexedDB } from 'react-indexed-db';
import { updateTrackedRepo } from '../reducers/TrackedRepos';

export default function LeftSidebar() {
  //#region Styles
  const drawerWidth = useContext(DrawerContext);
  const useStyles = makeStyles((theme) => ({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      overflowX: 'hidden',
    },
    listItemText: {
      wordWrap: 'break-word',
    },
  }));
  const classes = useStyles();
  //#endregion

  const dispatch = useDispatch();
  const { update } = useIndexedDB('trackedRepos');
  const searchResults = useSelector((state) => state.searchResults);
  const trackedRepos = useSelector((state) => state.trackedRepos);
  const selectedRepo = useSelector((state) => state.selectedRepo);

  const getColor = (repo) => {
    const isBeingTracked = checkIfRepoIsBeingTracked(trackedRepos, repo);

    if (isBeingTracked) {
      if (!repo.seen) return 'green';
      else if (searchResults.length) return 'grey';
    }
    return 'black';
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <SearchBar label="Search for a GitHub repo" />
      <Divider />
      {searchResults.length === 0 && trackedRepos.length > 0 && (
        <>
          <RefreshButton />
          <Divider />
        </>
      )}
      <List>
        {(searchResults.length ? searchResults : trackedRepos).map((repo, index) => (
          <Fragment key={repo.key}>
            <ListItem
              selected={repo.key === selectedRepo?.key}
              button
              style={{ color: getColor(repo) }}
              onClick={() => {
                const isBeingTracked = checkIfRepoIsBeingTracked(trackedRepos, repo);
                if (!repo?.latestRelease?.name && !repo?.commits?.length) {
                  getLatestActivityForRepo(repo.details.owner, repo.details.name).then(
                    ([latestRelease, commits]) => {
                      const updatedRepo = {
                        ...repo,
                        latestRelease,
                        commits,
                      };

                      dispatch(
                        modifySearchResult({
                          index,
                          repo: updatedRepo,
                        })
                      );
                      dispatch(setSelectedRepo(updatedRepo));
                    }
                  );
                } else {
                  const seenRepo = { ...repo, seen: true };
                  if (isBeingTracked) {
                    update(seenRepo).then(
                      () => dispatch(updateTrackedRepo({ index, repo: seenRepo })),
                      (error) => console.error(error)
                    );
                  }
                  dispatch(setSelectedRepo(seenRepo));
                }
              }}
            >
              <ListItemText className={classes.listItemText} primary={repo.details.fullName} />
            </ListItem>
            <Divider />
          </Fragment>
        ))}
      </List>
    </Drawer>
  );
}
