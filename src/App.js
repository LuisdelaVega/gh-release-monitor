import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Main from './Main';
import getStore from './store';
import { Provider } from 'react-redux';
import { DBConfig } from './DBConfig';
import { initDB } from 'react-indexed-db';

initDB(DBConfig);

const store = getStore();

function App() {
  //#region Styles
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
  }));
  const classes = useStyles();
  //#endregion

  return (
    <Provider store={store}>
      <div className={classes.root}>
        <CssBaseline />
        <Main />
      </div>
    </Provider>
  );
}

export default App;
