import * as React from 'react';
import { ProfileMenu } from './components';
import { IRoute } from '../../../';
import './Sidebar.scss';
import Scrollbars from 'react-custom-scrollbars';
import * as ReactTooltip from 'react-tooltip';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * possible routes for the app
   */
  routes: IRoute[];
  /**
   * information about currently logged in user
   */
  user?: {
    /**
     * user's first name
     */
    firstName: string;
    /**
     * user's last name
     */
    lastName: string;
    /**
     * path to user image
     */
    picture?: string;
    /**
     * whether the user is an admin
     */
    isAdmin?: boolean;
  };
  /**
   * the size of the sidebar (normal or mini)
   */
  size?: 'normal' | 'mini';
  /**
   * function to sign user out
   */
  signOut: () => void;
  /**
   * the options to render in the profile menu popup
   */
  profileOptions?: {
    /**
     * the icon to show next to the text
     */
    icon?: React.ReactNode;
    /**
     * the text to show for each options
     */
    text: string;
    /**
     * the action to perform when clicking the option
     */
    action: (...args: any[]) => void;
  }[];
}

/** 
 * The sidebar of the dashboard
 */
const SidebarBase = (props: IProps & RouteComponentProps) => {
  return (
    <div className={`sidebar ${props.className ? props.className : ''} ${props.size === 'mini' ? 'mini' : ''}`}>
        <ProfileMenu
          user={props.user}
          signOut={props.signOut}
          size={props.size}
          profileOptions={props.profileOptions}
        />
        <Scrollbars autoHide className='sidebar__content'>
          <ul className='sidebar__list'>
            {generateMenuItems(props.routes, props.location.pathname, props.user && props.user.isAdmin, props.size)}
          </ul>
          <div className='sidebar__scroll'/>
          { // Render tooltip for mini sidebar 
            props.size === 'mini' &&
            <ReactTooltip className='sidebar__tooltip' place='right' effect='solid' offset={{ left: 13 }} />
          }
        </Scrollbars>
    </div>
  );
};

// Attach router to add navigation functions
/** 
 * The sidebar of the dashboard
 */
export const Sidebar = withRouter(SidebarBase);

// HELPERS

/**
 * Determine the index of the active page in our routes array
 * @returns
 * @param {number} index - index of active page in routes array
 */
const getActiveIndex = (routes: IRoute[], path: string) => {
  for (let i = 0; i < routes.length; i++) {
    // Look for match based on route rules
    if ((path === routes[i].path && routes[i].exact) || (path.includes(routes[i].path) && !routes[i].exact)) {
      return i;
    }
  }
  return -1;
};

/**
 * Generates the sidebar menu items based on the routes supplied to the Dashboard
 */
const generateMenuItems = (routes: IRoute[], path: string, isAdmin?: boolean, size?: 'normal' | 'mini') => {
  // See which menu item should be active
  const activeIndex = getActiveIndex(routes, path);

  // Return items (that aren't hidden)
  return routes.filter((route) => !route.hidden).map((route, index) => {
    // Render route if it is not an admin route, or if the user is an admin
    if (!route.adminOnly || isAdmin) {
      return (
        <li
          key={index}
          className={`sidebar__listItem ${index === activeIndex ? 'active' : ''} ${size === 'mini' ? 'mini' : ''}`}
          data-tip={route.name}
        >
        { // Load normal link if an override link is provided
          route.overrideLink &&
          <a href={route.overrideLink}>{route.icon} {size !== 'mini' ? route.name : ''}</a>
        }
        { // Load a special link (no refresh required) if using the normal route path
          !route.overrideLink &&
          <Link to={route.path}>{route.icon} {size !== 'mini' ? route.name : ''}</Link>
        }
        </li>
      );
    }
    // Otherwise don't render route
    return;
  });
};