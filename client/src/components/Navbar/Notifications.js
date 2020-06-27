import React, { useContext } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import TimeAgo from "../ui/TimeAgo";
import { makeStyles } from "@material-ui/core";
import {
  markAsRead,
  getNotifications
} from "../../services/notificationsService";
import { useHistory } from "react-router-dom";
import { NotifierContext } from "../../contexts/NotifierContext";
import { retrieveImgUrl } from "../../lib/profile";

const useStyles = makeStyles(theme => ({
  item: {
    marginTop: "2px",
    marginBottom: "2px",
    minWidth: 200,
    "&:hover": {
      cursor: "pointer",
      transition: "all 0.5s ease-out",
      backgroundColor: theme.palette.action.hover
    }
  },
  unread: {
    borderRight: `5px solid ${theme.palette.secondary.main}`
  }
}));

export default function Notifications({ notifications, handleMenuClose }) {
  const classes = useStyles();
  const history = useHistory();
  const { setNotifications } = useContext(NotifierContext);

  const handleOpenNotification = async notification => {
    const { _id, read } = notification;
    const caseToShow = notification.case;
    handleMenuClose();
    history.push("/app", { caseToShow });
    if (!read)
      try {
        const markedRead = await markAsRead(_id);
        if (markedRead.success) {
          const { notifications } = await getNotifications();
          setNotifications(notifications);
        }
      } catch (error) {
        console.log(error);
      }
  };

  if (!notifications) return null;

  const notify = notifications.map(notify => {
    const userImage = retrieveImgUrl(notify.case.user, 80);
    return { ...notify, userImage };
  });

  return notify.map((n, index) => (
    <ListItem
      key={index}
      alignItems="flex-start"
      className={`${classes.item} ${n.read || classes.unread}`}
      onClick={() => handleOpenNotification(n)}
    >
      <ListItemAvatar>
        <Avatar alt={n.user.fullName} src={n.userImage} />
      </ListItemAvatar>
      <ListItemText
        primary={`${n.case.user.name} is ${Math.round(n.distance)} meters away`}
        secondary={
          <React.Fragment>
            <TimeAgo date={new Date(n.case.createdAt)} />
          </React.Fragment>
        }
      />
    </ListItem>
  ));
}
