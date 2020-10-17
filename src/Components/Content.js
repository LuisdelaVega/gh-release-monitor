import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { Avatar, Link } from '@material-ui/core';
import { stringToColor } from '../helpers';
import TrackButton from './TrackButton';

export default function Content({ title }) {
  //#region Styles
  const useStyles = makeStyles((theme) => {
    return {
      paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
      commit: {
        borderBottom: '1px solid rgba(193, 193, 193, 0.47)',
        marginBottom: 10,
      },
      commitLink: {
        marginLeft: 10,
      },
      commitMessage: {
        marginLeft: 50,
      },
      avatarSection: {
        display: 'flex',
        alignItems: 'center',
      },
      // necessary for content to be below app bar
      toolbar: theme.mixins.toolbar,
      content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
      },
    };
  });
  const classes = useStyles();
  //#endregion

  const selectedRepo = useSelector((state) => state.selectedRepo);
  const lastUpated =
    selectedRepo.latestRelease?.publishedAtTimeString || selectedRepo.commits[0]?.dateTimeString;

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      {selectedRepo?.key && <TrackButton />}
      {lastUpated && (
        <>
          <h2>Last updated:</h2>
          <p>{lastUpated}</p>
          <hr />
        </>
      )}
      {selectedRepo.latestRelease?.body && (
        <>
          <h2>Latest release:</h2>
          <ReactMarkdown linkTarget="_blank" source={selectedRepo.latestRelease.body} />
          <hr />
        </>
      )}
      {selectedRepo.commits?.length > 0 && <h2>Latest commits:</h2>}
      {selectedRepo.commits?.map((commit) => {
        const color = stringToColor(commit.author);

        return (
          <div key={commit.url} className={classes.commit}>
            <div className={classes.avatarSection}>
              <Avatar
                alt={commit.author}
                src="/broken-image.jpg"
                style={{
                  backgroundColor: color,
                  marginRight: 10,
                }}
              />
              <b>{commit.author}</b>{' '}
              <Link
                target="_blank"
                rel="noreferrer"
                href={commit.url}
                className={classes.commitLink}
              >
                {commit.dateTimeString}
              </Link>
            </div>
            <div className={classes.commitMessage}>{commit.message}</div>
          </div>
        );
      })}
      {!selectedRepo?.key && (
        <ReactMarkdown
          linkTarget="_blank"
          source={`# GitHub Repo tracker
          
This tool was built by [Luis de la Vega Lopez](https://www.linkedin.com/in/luisrdelavega/) for a takehome assignment for [Lumanu](https://www.lumanu.com/). ❤️
          `}
        />
      )}
    </main>
  );
}
