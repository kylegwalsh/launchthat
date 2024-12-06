import * as React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import './Header.scss';

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * other header components that should be rendered (supplied by dashboard)
   */
  otherComponents?: React.ReactNode;
  /**
   * relative path to header logo in public folder
   */
  logo: string;
  /**
   * the default route of the dashboard
   */
  defaultRoute?: string;
}

/** 
 * The header of the dashboard
 */
const HeaderBase = (props: IProps & RouteComponentProps) => {
  return (
    <div className={`header primaryColor ${props.className ? props.className : ''}`}>
      <Link 
        to={props.defaultRoute || '/'}
        className='header__logo'
      >
        <img src={props.logo} className='header__logo__image'/>
      </Link>

      { // Any additional header components will render in the header
        props.otherComponents &&
        props.otherComponents
      }
    </div>
  );
};

// Attach router to add navigation functions
/** 
 * The header of the dashboard
 */
export const Header = withRouter(HeaderBase);