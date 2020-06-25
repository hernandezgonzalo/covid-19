import React, { useState, useContext } from "react";
import { useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import SearchDialog from "./Search";
import ToggleTheme from "./ToggleTheme";
import { Tooltip, Avatar, List } from "@material-ui/core";
import TimelineIcon from "@material-ui/icons/Timeline";
import { useHistory } from "react-router-dom";
import Icon from "@material-ui/core/Icon";
import { useStyles } from "./styles";
import { useUser, useUserLogout } from "../../services/authService";
import LoginDialog from "../../pages/auth/LoginDialog";
import _ from "lodash";
import { NotifierContext } from "../../contexts/NotifierContext";
import Notifications from "./Notifications";
import { retrieveImgUrl } from "../../lib/profile";

export const Navbar = ({ toggleTheme }) => {
  const user = useUser();
  const logout = useUserLogout();
  const theme = useTheme();
  const history = useHistory();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [notificationsEl, setNotificationsEl] = React.useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const { notifications } = useContext(NotifierContext);

  const userImage = retrieveImgUrl(user, 50);

  const UserAvatar = () => (
    <Avatar alt={user.name} src={userImage} className={classes.avatar} />
  );

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationsOpen = Boolean(notificationsEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = event => {
    if (!_.isEmpty(notifications)) setNotificationsEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleOpenLogin = () => {
    handleMenuClose();
    setOpenLogin(true);
  };

  const NotificationsRef = React.forwardRef((props, ref) => (
    <List dense ref={ref} style={{ padding: 0 }}>
      {props.children}
    </List>
  ));

  const notificationsId = "notifications-menu";
  const renderNotifications = (
    <Menu
      anchorEl={notificationsEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={notificationsId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isNotificationsOpen}
      onClose={handleMenuClose}
    >
      <NotificationsRef>
        <Notifications {...{ notifications, handleMenuClose }} />
      </NotificationsRef>
    </Menu>
  );

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {user && (
        <MenuItem button divider disabled>
          {user.fullName}
        </MenuItem>
      )}
      {user && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            history.push("/auth/profile");
          }}
        >
          My profile
        </MenuItem>
      )}
      {user && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            logout();
            history.push("/");
          }}
        >
          Logout
        </MenuItem>
      )}
      {!user && <MenuItem onClick={handleOpenLogin}>Login</MenuItem>}
      {!user && (
        <MenuItem
          onClick={() => {
            handleMenuClose();
            history.push("/auth/signup");
          }}
        >
          Sign up
        </MenuItem>
      )}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          {userImage ? <UserAvatar /> : <AccountCircle />}
        </IconButton>
        <span>Profile</span>
      </MenuItem>
      {user && (
        <MenuItem
          aria-controls={notificationsId}
          aria-haspopup="true"
          onClick={handleNotificationsOpen}
        >
          <IconButton aria-label="show notifications" color="inherit">
            <Badge
              badgeContent={notifications?.filter(n => !n.read).length}
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <span>Notifications</span>
        </MenuItem>
      )}
      <MenuItem>
        <ToggleTheme theme={theme} toggleTheme={toggleTheme}>
          <span>Toggle theme</span>
        </ToggleTheme>
      </MenuItem>
      <MenuItem>
        <SearchDialog>
          <span>Find a country</span>
        </SearchDialog>
      </MenuItem>
      <MenuItem onClick={() => history.push("/app")}>
        <IconButton aria-label="Corona App" color="inherit">
          <Icon className="fas fa-virus" />
        </IconButton>
        <span>Conora App</span>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar
        position="sticky"
        style={{ backgroundColor: theme.palette.navbar }}
        elevation={1}
      >
        <Toolbar>
          <Tooltip title="Home">
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="home"
              onClick={() => history.push("/")}
            >
              <TimelineIcon />
            </IconButton>
          </Tooltip>
          <Typography className={classes.title} variant="h6" noWrap>
            COVID-19 PANDEMIC STATISTICS
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Tooltip title="Corona App">
              <IconButton
                aria-label="Corona App"
                color="inherit"
                onClick={() => history.push("/app")}
              >
                <Icon className="fas fa-virus" />
              </IconButton>
            </Tooltip>
            <SearchDialog />
            <ToggleTheme theme={theme} toggleTheme={toggleTheme} />
            {user && (
              <Tooltip title="Notifications">
                <IconButton
                  aria-label="show notifications"
                  color="inherit"
                  aria-controls={notificationsId}
                  aria-haspopup="true"
                  onClick={handleNotificationsOpen}
                >
                  <Badge
                    badgeContent={notifications?.filter(n => !n.read).length}
                    color="secondary"
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="User account">
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {userImage ? <UserAvatar /> : <AccountCircle />}
              </IconButton>
            </Tooltip>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderNotifications}
      {renderMenu}
      {<LoginDialog {...{ openLogin, setOpenLogin }} />}
    </div>
  );
};
