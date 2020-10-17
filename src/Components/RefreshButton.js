import { Button } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIndexedDB } from 'react-indexed-db';
import { updateTrackedRepo } from '../reducers/TrackedRepos';
import { getLatestActivityForRepo } from '../api/octokitRequests';

export default function RefreshButton() {
  const dispatch = useDispatch();
  const { update } = useIndexedDB('trackedRepos');
  const trackedRepos = useSelector((state) => state.trackedRepos);

  const handleOnClick = () => {
    const promises = [];
    trackedRepos.forEach((repo) => {
      promises.push(getLatestActivityForRepo(repo.details.owner, repo.details.name));
    });

    Promise.all(promises).then((values) => {
      values.forEach(([latestRelease, commits], index) => {
        // Create new object that's a copy of the repo
        const trakedRepo = { ...trackedRepos[index] };
        if (latestRelease?.publishedAt) {
          if (
            !trakedRepo?.latestRelease?.publishedAt ||
            new Date(latestRelease.publishedAt) > new Date(trakedRepo.latestRelease.publishedAt)
          ) {
            trakedRepo.latestRelease = latestRelease;
            trakedRepo.seen = false;
          }
        }
        if (new Date(commits[0].date) > new Date(trakedRepo.commits[0].date)) {
          trakedRepo.commits = commits;
          trakedRepo.seen = false;
        }
        update(trakedRepo).then(
          () => dispatch(updateTrackedRepo({ index, repo: trakedRepo })),
          (error) => console.error(error)
        );
      });
    });
  };

  return (
    <Button variant="outlined" color="primary" onClick={handleOnClick}>
      {'Check for updates'}
    </Button>
  );
}
