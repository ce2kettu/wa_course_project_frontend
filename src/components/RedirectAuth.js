import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../reducers/auth';

// Redirect user if already authenticated, used for login and register at least
function RedirectAuth({ children }) {
  const { state: authState } = useContext(AuthContext);

  if (authState.isAuthenticated) {
    return <Navigate to="/" replace={true} />;
  }

  return children;
}

export default RedirectAuth;
