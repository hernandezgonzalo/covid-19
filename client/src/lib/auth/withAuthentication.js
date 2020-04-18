import React, { useState, useEffect } from "react";
import { UserContext, loggedin } from "../../services/authService";

export const withAuthentication = Component => () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get the current logged in user from the backend
    loggedin()
      .then(res => setUser(res.user))
      .catch(error => console.log(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {/* {loading && <div>Loading...</div>} */}
      <Component />
    </UserContext.Provider>
  );
};
