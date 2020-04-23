import React, { useState, useEffect } from "react";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(theme => ({
  input: { display: "none" },
  image: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.text.primary
    }
  }
}));

const UploadPhoto = ({ profilePic, setProfilePic }) => {
  const classes = useStyles();
  const [state, setState] = useState({ file: null });

  useEffect(() => {
    if (profilePic) setState({ file: URL.createObjectURL(profilePic) });
  }, [profilePic]);

  const handleChange = event => setProfilePic(event.target.files[0]);

  return (
    <div>
      <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        type="file"
        onChange={handleChange}
      />
      <label htmlFor="contained-button-file">
        <Avatar src={state.file} className={classes.image}>
          {state.file || <AddAPhotoIcon />}
        </Avatar>
      </label>
    </div>
  );
};

export default UploadPhoto;
