import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import {
  useUserSetter,
  useUser,
  useUserLogout
} from "../../../services/authService";
import { NotifierContext } from "../../../contexts/NotifierContext";
import { useStyles } from "./styles";
import { withProtected } from "../../../lib/auth/withProtected";
import cloudinary from "cloudinary-core";
import _ from "lodash";
import { updateProfile, deleteAccount } from "../../../services/profileService";
import { useConfirm } from "material-ui-confirm";
import { useHistory } from "react-router-dom";
import Backdrop from "@material-ui/core/Backdrop";
import { CircularProgress } from "@material-ui/core";

const EMAIL_PATTERN = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const cloudy = cloudinary.Cloudinary.new({
  cloud_name: process.env.REACT_APP_CLOUDINARY_NAME
});

export const Profile = withProtected(() => {
  const history = useHistory();
  const confirm = useConfirm();
  const user = useUser();
  const setUser = useUserSetter();
  const logout = useUserLogout();
  const classes = useStyles();
  const { setFlash } = useContext(NotifierContext);
  const [isBusy, setIsBusy] = useState(false);
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    defaultValues: {
      username: user?.username,
      password: "",
      name: user?.name,
      surname: user?.surname,
      email: user?.email
    }
  });

  let userImage;
  if (user) {
    const userImg = _.get(user, "image.public_id");
    userImage = cloudy.url(userImg, {
      width: 200,
      height: 200,
      crop: "fill",
      secure: true
    });
  }

  const UserAvatar = () => (
    <Avatar alt="User image" src={userImage} className={classes.avatar} />
  );

  const onSubmit = async data => {
    setIsBusy(true);
    updateProfile(data)
      .then(user => {
        setUser(user);
        setFlash({ type: "success", message: `Profile updated` });
      })
      .catch(error => {
        setFlash({ type: "error", message: error.response.data.message });
      })
      .finally(() => setIsBusy(false));
  };

  const handleDelete = () => {
    confirm({
      title: "Delete account",
      description: "You are about to delete your user account. Are you sure?",
      confirmationText: "Yes",
      cancellationText: "No",
      dialogProps: { maxWidth: "xs" }
    })
      .then(async () => {
        setIsBusy(true);
        try {
          await deleteAccount();
          history.push("/");
          logout();
          setFlash({ type: "success", message: "Account deleted" });
        } catch (error) {
          console.error(error.response?.data.message);
        }
      })
      .catch(() => null);
  };

  const inputStyle = {
    variant: "outlined",
    margin: "dense",
    size: "small",
    fullWidth: true
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <UserAvatar />
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <TextField
            required
            id="username"
            label="Username"
            name="username"
            inputRef={register({ required: true })}
            {...inputStyle}
            error={!!errors.username}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            id="password"
            inputRef={register({ minLength: 4 })}
            {...inputStyle}
            error={!!errors.password}
            helperText={
              !!errors.password && "Password must be at least 4 characters long"
            }
          />
          <Grid container spacing={1}>
            <Grid item sm={6} xs={12}>
              <TextField
                required
                id="name"
                label="Name"
                name="name"
                inputRef={register({ required: true })}
                {...inputStyle}
                error={!!errors.name}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                id="surname"
                label="Surname"
                name="surname"
                {...inputStyle}
                inputRef={register()}
              />
            </Grid>
          </Grid>
          <TextField
            id="email"
            label="Email Address"
            name="email"
            {...inputStyle}
            inputRef={register({ pattern: EMAIL_PATTERN })}
            error={!!errors.email}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Update profile
          </Button>
        </form>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.delete}
          onClick={handleDelete}
        >
          Delete account
        </Button>
      </div>
      <Backdrop className={classes.backdrop} open={isBusy}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
});
