import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { DrawerContext } from '../Main';

export default function Topbar({ title }) {
  //#region Styles
  const drawerWidth = useContext(DrawerContext);
  const useStyles = makeStyles((theme) => ({
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      backgroundColor: '#24292e',
    },
  }));
  const classes = useStyles();
  //#endregion

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
