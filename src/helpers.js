export const cleanRepoDetails = (repo, seen) => {
  return {
    key: repo.full_name || repo.fullName,
    details: {
      fullName: repo.full_name || repo.fullName,
      name: repo.name,
      owner: repo.owner.login,
    },
    seen: !!seen,
  };
};

export const cleanLatestRelease = (latestRelease) => {
  if (!latestRelease) return {};

  return {
    publishedAt: latestRelease.published_at || latestRelease.publishedAt,
    publishedAtTimeString: new Date(
      latestRelease.published_at || latestRelease.publishedAt
    ).toString(),
    body: latestRelease.body,
    name: latestRelease.name,
    url: latestRelease.url,
  };
};

export const cleanCommit = ({ commit, html_url }) => {
  return {
    author: commit.author.name,
    message: commit.message,
    url: html_url,
    date: commit.author.date,
    dateTimeString: new Date(commit.author.date).toString(),
  };
};

/**
 * Source: https://stackoverflow.com/a/16348977
 */
export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
};

export const checkIfRepoIsBeingTracked = (trackedRepos, repo) =>
  trackedRepos.filter((trackedRepo) => trackedRepo.key === repo.key).length > 0;
