import React, { useEffect, useRef, useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { signup, useUserSetter } from "../../../services/authService";
import LoginDialog from "../LoginDialog";
import { NotifierContext } from "../../../contexts/NotifierContext";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { Box, CircularProgress } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { useStyles } from "./styles";

const EMAIL_PATTERN = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export default function SignUp() {
  const history = useHistory();
  const setUser = useUserSetter();
  const classes = useStyles();
  const [openLogin, setOpenLogin] = useState(false);
  const { setFlash } = useContext(NotifierContext);
  const [isProfilePic, setIsProfilePic] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, errors } = useForm({ mode: "onBlur" });

  const onSubmit = async data => {
    setIsUploading(true);
    signup(data)
      .then(res => {
        setUser(res.user);
        history.push("/");
        setFlash({
          type: "success",
          message: `Welcome, ${res.user.name}`
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

  const handleOpenLogin = event => {
    event.preventDefault();
    setOpenLogin(true);
  };

  const inputStyle = {
    variant: "outlined",
    margin: "dense",
    size: "small",
    fullWidth: true
  };

  const usernameRef = useRef();
  useEffect(() => usernameRef.current.focus(), []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
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
            autoFocus
            inputRef={e => {
              register(e, { required: true });
              usernameRef.current = e;
            }}
            {...inputStyle}
            error={!!errors.username}
          />
          <TextField
            required
            name="password"
            label="Password"
            type="password"
            id="password"
            inputRef={register({ required: true, minLength: 4 })}
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
          <Box mt={1}>
            <input
              name="profilePic"
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              type="file"
              ref={register()}
              onChange={() => setIsProfilePic(true)}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                color="default"
                component="span"
                startIcon={isProfilePic ? <CheckIcon /> : <PhotoCamera />}
              >
                Upload a photo
              </Button>
            </label>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isUploading}
          >
            {isUploading ? <CircularProgress size={24} /> : "Create account"}
          </Button>
          <Grid container>
            <Grid item>
              <Link href="" onClick={handleOpenLogin} variant="body2">
                {"Already have an account?"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <LoginDialog {...{ openLogin, setOpenLogin }} />
    </Container>
  );
}
