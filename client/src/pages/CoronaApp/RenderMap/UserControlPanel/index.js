import React, { useEffect, useState } from "react";
import { Chip, Avatar, Box } from "@material-ui/core";
import { checkUserCase, removeCase } from "../../../../services/appService";
import cloudinary from "cloudinary-core";
import _ from "lodash";
import { useUser } from "../../../../services/authService";
import TimeAgo from "../../../../components/ui/TimeAgo";
import { useGoogleMap } from "@react-google-maps/api";
import { useStyles } from "./styles";
import { useHistory } from "react-router-dom";
import AddCircleTwoToneIcon from "@material-ui/icons/AddCircleTwoTone";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";
import { useConfirm } from "material-ui-confirm";

const cloudy = cloudinary.Cloudinary.new({
  cloud_name: process.env.REACT_APP_CLOUDINARY_NAME
});

const UserControlPanel = ({ cases, setSelected, selected }) => {
  const [caseInfo, setCaseInfo] = useState();
  const user = useUser();
  const classes = useStyles();
  const map = useGoogleMap();
  const history = useHistory();
  const confirm = useConfirm();

  let userImage;
  if (user) {
    const userImg = _.get(user, "image.public_id");
    userImage = cloudy.url(userImg, {
      width: 50,
      height: 50,
      crop: "fill",
      secure: true
    });
  }

  useEffect(() => {
    checkUserCase().then(res => {
      if (res.case) {
        setCaseInfo({
          infected: true,
          date: res.case.createdAt,
          location: res.case.user.location.coordinates
        });
      } else setCaseInfo({ infected: false });
    });
  }, [cases]);

  const handleRemovePositive = () => {
    confirm({
      title: "Remove notification",
      description:
        "You are about to remove your notification. Are you already cured?",
      confirmationText: "Yes",
      cancellationText: "No",
      dialogProps: { maxWidth: "xs" }
    }).then(async () => {
      try {
        const removed = await removeCase();
        if (removed.case?._id === selected.id) setSelected({});
      } catch (error) {
        console.error(error.response?.data.message);
      }
    });
  };

  const handleShowMe = () => {
    const geo = user.location.coordinates;
    map.setCenter({ lat: geo[1], lng: geo[0] });
    map.setZoom(15);

    const findSelected = cases?.filter(c => c.user.id === user.id);
    if (!_.isEmpty(findSelected)) setSelected(findSelected[0]);
  };

  const RegisteredSince = () => (
    <span className={classes.button} onClick={handleShowMe}>
      Registered as positive <TimeAgo date={new Date(caseInfo.date)} />
    </span>
  );

  if (!caseInfo) return null;

  if (caseInfo.infected)
    return (
      <Box zIndex="modal" p={2} position="absolute" bottom={0}>
        <Chip
          className={classes.infected}
          deleteIcon={<HighlightOffTwoToneIcon className={classes.button} />}
          onDelete={handleRemovePositive}
          avatar={<Avatar src={userImage} />}
          label={<RegisteredSince />}
        />
      </Box>
    );

  return (
    <Box zIndex="modal" p={2} position="absolute" bottom={0}>
      <Chip
        className={classes.clean}
        deleteIcon={<AddCircleTwoToneIcon className={classes.button} />}
        onDelete={() => history.push("/app/test")}
        avatar={<Avatar src={userImage} />}
        label={
          <span className={classes.button} onClick={handleShowMe}>
            You are not registered as positive
          </span>
        }
      />
    </Box>
  );
};

export default UserControlPanel;
