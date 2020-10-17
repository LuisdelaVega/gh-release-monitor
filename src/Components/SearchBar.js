import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { CircularProgress, InputAdornment } from '@material-ui/core';
import { clearSelectedRepo, setSelectedRepo } from '../reducers/SelectedRepo';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearSearchResults,
  modifySearchResult,
  setSearchResults,
} from '../reducers/SearchResults';
import { getLatestActivityForRepo, getRepositoriesFromString } from '../api/octokitRequests';

export default function SearchBar({ label }) {
  //#region Styles
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '31ch',
      },
    },
  }));
  const classes = useStyles();
  //#endregion

  const dispatch = useDispatch();
  const [currentTimeout, setCurrentTimeout] = useState();
  const [inputProps, setInputProps] = useState({});
  const trackedRepos = useSelector((state) => state.trackedRepos);

  const executeSearch = (repoName) =>
    setTimeout(() => {
      setInputProps({
        endAdornment: (
          <InputAdornment position="end">
            <CircularProgress />
          </InputAdornment>
        ),
      });

      getRepositoriesFromString(repoName)
        .then((items) => {
          if (items.length) {
            // Get the first item in the list to populate the right side
            const firstResult = items[0];
            firstResult.seen = true;
            items.splice(0, 1, firstResult);

            dispatch(setSearchResults(items));

            getLatestActivityForRepo(firstResult.details.owner, firstResult.details.name).then(
              ([latestRelease, commits]) => {
                const repo = { ...firstResult, latestRelease, commits };
                dispatch(setSelectedRepo(repo));
                dispatch(modifySearchResult({ index: 0, repo }));
              }
            );
          }
        })
        .finally(() => setInputProps({}));
    }, 1000);

  /**
   * Search automatically 1 second after the user stops typing.
   * Inspired by the extensions search bar in vscode.
   */
  const handleOnChange = ({ target }) => {
    const { value } = target;

    if (currentTimeout) clearTimeout(currentTimeout);
    if (value) setCurrentTimeout(executeSearch(value));
    else {
      dispatch(clearSearchResults());
      if (trackedRepos.length) dispatch(setSelectedRepo(trackedRepos[0]));
      else dispatch(clearSelectedRepo());
    }
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField
        id="outlined-basic"
        label={label}
        variant="outlined"
        onChange={handleOnChange}
        InputProps={inputProps}
        onKeyPress={(e) => {
          if (e.charCode === 13) {
            e.preventDefault();
          }
        }}
      />
    </form>
  );
}
