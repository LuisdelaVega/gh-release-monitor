import { Octokit } from '@octokit/core';
import { cleanCommit, cleanLatestRelease, cleanRepoDetails } from '../helpers';

const octokit = new Octokit();

export const getRepositoriesFromString = (value) =>
  octokit
    .request('GET /search/repositories?q={repo}', {
      repo: value,
    })
    .then(({ data }) => {
      const { items } = data;
      return items.map(cleanRepoDetails);
    })
    .catch((e) => console.error(e));

const getLatestReleaseForRepo = (owner, repo) =>
  octokit
    .request('GET /repos/{owner}/{repo}/releases', {
      owner,
      repo,
    })
    .then(({ data: releases }) => cleanLatestRelease(releases[0]))
    .catch((e) => console.error(e));

const getCommitsForRepo = (owner, repo) =>
  octokit
    .request('GET /repos/{owner}/{repo}/commits', {
      owner,
      repo,
    })
    .then(({ data: commits }) => commits.map(cleanCommit))
    .catch((e) => console.error(e));

export const getLatestActivityForRepo = (owner, repo) =>
  Promise.all([getLatestReleaseForRepo(owner, repo), getCommitsForRepo(owner, repo)])
    .then((latestActivity) => latestActivity)
    .catch((e) => console.error(e));
