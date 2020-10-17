import { Button } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIndexedDB } from 'react-indexed-db';
import { addToTrackedRepos, removeFromTrackedRepos } from '../reducers/TrackedRepos';
import { checkIfRepoIsBeingTracked } from '../helpers';
import { clearSelectedRepo } from '../reducers/SelectedRepo';

export default function TrackButton() {
  const dispatch = useDispatch();
  const trackedRepos = useSelector((state) => state.trackedRepos);
  const selectedRepo = useSelector((state) => state.selectedRepo);
  const { add, deleteRecord } = useIndexedDB('trackedRepos');
  const isBeingTracked = checkIfRepoIsBeingTracked(trackedRepos, selectedRepo);

  const handleOnClick = () => {
    if (!isBeingTracked) {
      add(selectedRepo).then(
        () => dispatch(addToTrackedRepos(selectedRepo)),
        (error) => console.error(error)
      );
    } else {
      deleteRecord(selectedRepo.key).then(
        () => {
          dispatch(removeFromTrackedRepos(selectedRepo));
          if (trackedRepos.length === 1) dispatch(clearSelectedRepo());
        },
        (error) => console.error(error)
      );
    }
  };

  return (
    <Button
      variant="outlined"
      color={isBeingTracked ? 'secondary' : 'primary'}
      onClick={handleOnClick}
    >
      {isBeingTracked ? 'Remove repo' : 'Track repo'}
    </Button>
  );
}
