import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useUserSetter, useUser } from "../../../services/authService";
import { NotifierContext } from "../../../contexts/NotifierContext";
import { CircularProgress } from "@material-ui/core";
import { useStyles } from "./styles";
import { withProtected } from "../../../lib/auth/withProtected";
import cloudinary from "cloudinary-core";
import _ from "lodash";
import { updateProfile } from "../../../services/profileService";

const EMAIL_PATTERN = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const cloudy = cloudinary.Cloudinary.new({
  cloud_name: process.env.REACT_APP_CLOUDINARY_NAME
});

export const Profile = withProtected(() => {
  const user = useUser();
  const setUser = useUserSetter();
  const classes = useStyles();
  const { setFlash } = useContext(NotifierContext);
  const [isUploading, setIsUploading] = useState(false);
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
    setIsUploading(true);
    updateProfile(data)
      .then(user => {
        setUser(user);
        setIsUploading(false);
        setFlash({
          type: "success",
          message: `Profile updated`
        });
      })
      .catch(error => {
        setIsUploading(false);
        setFlash({
          type: "error",
          message: error.response.data.message
        });
      });
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
            disabled={isUploading}
          >
            {isUploading ? <CircularProgress size={24} /> : "Update profile"}
          </Button>
        </form>
      </div>
    </Container>
  );
});
