export const DBConfig = {
  name: 'TrackedRepos',
  version: 1,
  objectStoresMeta: [
    {
      store: 'trackedRepos',
      storeConfig: { keyPath: 'key', autoIncrement: false },
      storeSchema: [
        { name: 'key', keypath: 'key', options: { unique: true } },
        { name: 'details', keypath: 'details', options: { unique: false } },
        { name: 'latestRelease', keypath: 'latestRelease', options: { unique: false } },
        { name: 'commits', keypath: 'commits', options: { unique: false } },
        { name: 'seen', keypath: 'seen', options: { unique: false } },
      ],
    },
  ],
};
