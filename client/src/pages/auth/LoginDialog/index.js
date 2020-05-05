import React, { useState, useEffect, useRef, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { DialogActions, Button } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserSetter, login } from "../../../services/authService";
import { NotifierContext } from "../../../contexts/NotifierContext";
import { useStyles } from "./styles";

export default function LoginDialog({ openLogin, setOpenLogin }) {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpenLogin(false);

  useEffect(() => setOpen(openLogin), [openLogin]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogContent>
        <LoginForm {...{ handleClose }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

const LoginForm = ({ handleClose }) => {
  const history = useHistory();
  const location = useLocation();
  const setUser = useUserSetter();
  const classes = useStyles();
  const { setFlash } = useContext(NotifierContext);

  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onSubmit = data => {
    login(data)
      .then(user => {
        setUser(user);
        handleClose();
        if (location.pathname === "/auth/signup") history.push("/");
        setFlash({
          type: "success",
          message: `Welcome back, ${user.name}`
        });
      })
      .catch(error =>
        setFlash({ type: "error", message: error.response?.data.message })
      );
  };

  const handleSignUp = event => {
    event.preventDefault();
    handleClose();
    history.push("/auth/signup");
  };

  const inputStyle = {
    variant: "outlined",
    margin: "dense",
    size: "small",
    fullWidth: true,
    autoComplete: "off"
  };

  const inputRef = useRef();
  useEffect(() => inputRef.current.focus(), []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOpenIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            required
            id="username"
            label="Username"
            name="username"
            autoFocus
            inputRef={e => {
              register(e, { required: true });
              inputRef.current = e;
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
            inputRef={register({ required: true })}
            {...inputStyle}
            error={!!errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
          <Grid container>
            <Grid item>
              <Link href="" onClick={handleSignUp} variant="body2">
                {"Don't have an account?"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};
