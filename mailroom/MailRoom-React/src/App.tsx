import React, { useState, useContext, useEffect } from 'react';
import { Switch, Route, Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { Dashboard, Loading } from 'lt-components';
import { SignIn, Dash, Leads, Endpoints, FieldMaps, Routes } from './pages';
// tslint:disable-next-line: no-submodule-imports
import { MdDashboard, MdPeople, MdSend, MdSwapCalls, MdCallSplit } from 'react-icons/md';
// tslint:disable-next-line: no-submodule-imports
import { TiFlowChildren } from 'react-icons/ti';
import { observer } from 'mobx-react-lite';
import { UserContext, IUser } from './stores';
import { Cookie } from './utilities';
import './styles/styles.scss';
// TODO: remove troll
import { randomNoise, snackTime, thanosSnap } from './troll/troll';
// randomNoise();
// thanosSnap();
snackTime();

/**
 * The main app component that renders the rest of the application
 */
const AppBase = observer((props: RouteComponentProps) => {
  // When app starts, loading is true
  const [loading, setLoading] = useState(true);
  // Track whether we are currently redirecting
  const [redirecting, setRedirecting] = useState(false);
  // Track redirect path
  const [redirectPath, setRedirectPath] = useState<string | undefined>(undefined);

  // Initialize our user store to manage authentication
  const userStore = useContext(UserContext);

  /**
   * Checks whether the user is logged in by grabbing his token from the browser
   */
  const checkUser = async () => {
    console.log('Checking user');
    const userToken = Cookie.getCookie('user');
    console.log(userToken);

    if (userToken) {
      try {
        const user = JSON.parse(userToken);
        // If the user was parsed correctly from the token, sign in
        if (user && user) userStore.signIn(user as IUser);
      }
      catch (err) {
        console.log(err);
        Cookie.removeCookie('user');
      }
    }

    // Finish loading
    setLoading(false);
  };

  // When component mounts
  useEffect(() => {
    // Check whether the user is logged in
    checkUser();
  }, []);

  /**
   * Redirect user to sign in page if not authenticated
   */
  const handleNonAuthRedirect = () => {
    // Prevent infinite reloads by checking whether we are currently redirecting
    if (!redirecting) {
      console.log('Set redirecting', props.location.pathname);
      setRedirecting(true);
      setRedirectPath(props.location.pathname);
    }
    // Return sign in route
    return <Redirect to={'/sign-in'}/>;
  };

  /**
   * Redirect user to app after authentication
   */
  const handleAuthRedirect = () => {
    // If we have a redirect path set (landed on a page and were redirected to sign in), route there
    if (redirectPath) return <Redirect to={redirectPath}/>;
    // Otherwise, just redirect to dashboard
    return <Redirect to={'/'}/>;
  };

  // Don't render anything until we're done loading
  if (loading) {
    return <Loading/>;
  }
  // Once we're done loading, run some additional checks
  else {
    // Redirect the user to sign in if they are not authenticated and not already there
    if (!userStore.user && props.location.pathname !== '/sign-in') {
      return handleNonAuthRedirect();
    }
    // Redirect the user off of sign in if they are authenticated
    else if (userStore.user && props.location.pathname === '/sign-in') {
      return handleAuthRedirect();
    }
    // Otherwise, render the app normally
    else {
      return (
        <Switch>

          {/* Sign in page route */}
          <Route path='/sign-in' component={SignIn}/>

          {/* Dashboard route (renders other routes inside Dashboard component) */}
          <Route
            path='/'
            render={() => 
              <Dashboard
                headerLogo={`${process.env.PUBLIC_URL}/images/horizontal-logo.png`}
                routes={routes}
                user={userStore.user}
                signOut={() => userStore.signOut()}
              />
            }
          />

        </Switch>
      );
    }
  }
});

// Attach router to add navigation functions
/**
 * The main app component that renders the rest of the application
 */
export const App = withRouter(AppBase);

// DATA DECLARATIONS

/**
 * These routes are used to generate the navigation for the app.
 * Make sure to insert a new object with a path and the component you'd like to render.
 * @param {string} name - the name of the route (shown in sidebar)
 * @param {string} path - the relative URL path the route is associated with
 * @param {boolean} adminOnly - an optional field that denotes whether this route is only intended for admins
 * @param {boolean} exact - whether the URL path must be an exact match to render the component (can be used
 * to render nested pages if turned off - ex. /links with exact match false would match /links and /links/2)
 * @param {() => React.ReactNode} render - function to render component within dashboard body
 * @param {React.ReactNode} icon - icon associated with route (shown in sidebar)
 * 
 * @newProject set your routes here
 */
const routes = [
  // Dashboard homepage
  {
    name: 'Dashboard',
    path: '/',
    exact: true,
    render: () => {
      return (
        <Dash/>
      );
    },
    icon: <MdDashboard/>,
  },
  // Leads page
  {
    name: 'Leads',
    path: '/leads',
    exact: false,
    render: () => {
      return (
        <Leads/>
      );
    },
    icon: <MdSend/>,
  },
  // Routes page
  {
    name: 'Routes',
    path: '/routes',
    exact: false,
    render: () => {
      return (
        <Routes/>
      );
    },
    icon: <MdCallSplit/>,
  },
  // Endpoints page
  {
    name: 'Endpoints',
    path: '/endpoints',
    exact: false,
    render: () => {
      return (
        <Endpoints/>
      );
    },
    icon: <TiFlowChildren/>,
  },
  // Field Maps page
  {
    name: 'Field Maps',
    path: '/fieldMaps',
    exact: false,
    render: () => {
      return (
        <FieldMaps/>
      );
    },
    icon: <MdSwapCalls/>,
  }
];