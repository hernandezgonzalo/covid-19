import React, { useContext, useEffect } from "react";
import { useUser, useUserIsLoading } from "./../../services/authService";
import { Redirect } from "react-router-dom";
import { NotifierContext } from "../../contexts/NotifierContext";

export const withProtected = (Component, role) => () => {
  const user = useUser();
  const isUserLoading = useUserIsLoading();
  const { setFlash } = useContext(NotifierContext);

  useEffect(() => {
    if (!user && !isUserLoading)
      setFlash({
        type: "error",
        message: "You have to be registered to access this page"
      });
  }, [user, isUserLoading, setFlash]);

  if (user) {
    if (role && user.role !== role) return <Redirect to="/" />;
    return <Component />;
  } else {
    if (isUserLoading) return null;
    return <Redirect to="/auth/signup" />;
  }
};
