import React, { createContext, useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import io from "socket.io-client";
import _ from "lodash";
import { useUser } from "../services/authService";
import { getNotifications } from "../services/notificationsService";

const socket = io(process.env.REACT_APP_SERVER);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2)
    }
  }
}));

export const NotifierContext = createContext();

const NotifierContextProvider = props => {
  const [flash, setFlash] = useState(null);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const user = useUser();
  const [notifications, setNotifications] = useState();

  useEffect(() => {
    if (user) {
      getNotifications().then(res => setNotifications(res.notifications));
      socket.on("broadcast", function ({ type, message, notifyUsers }) {
        const notifyMe = notifyUsers?.filter(notify => notify.user === user.id);
        if (!_.isEmpty(notifyMe)) setFlash({ type, message });
        getNotifications().then(res => setNotifications(res.notifications));
      });
    }
  }, [user]);

  useEffect(() => {
    if (flash) handleOpen();
  }, [flash]);

  const handleOpen = () => setOpen(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <NotifierContext.Provider
      value={{ setFlash, notifications, setNotifications }}
    >
      {props.children}

      {flash && (
        <div className={classes.root}>
          <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={flash.type}>
              {flash.message}
            </Alert>
          </Snackbar>
        </div>
      )}
    </NotifierContext.Provider>
  );
};

export default NotifierContextProvider;
