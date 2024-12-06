import * as React from 'react';
const { Fragment } = React;
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import './Breadcrumbs.scss';

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * a list of pages to link to from the breadcrumbs
   */
  pages: {
    /**
     * the icon to show next to the crumb
     */
    icon?: React.ReactNode;
    /**
     * the relative path that should be linked to (optional)
     */
    path?: string;
    /**
     * the text to show as the crumb
     */
    text: string;
  }[];
}

/**
 * Navigation breadcrumbs
 */
const BreadcrumbsBase = (props: IProps & RouteComponentProps) => {
  return (
    <div className={`breadcrumbs ${props.className ? props.className : ''}`}>
      { generateBreadcrumbs(props.pages) }
    </div>
  );
};

/**
 * Generate the breadcrumb links
 */
const generateBreadcrumbs = (pages: IProps['pages']) => {
  return pages.map((page: any, index) => {
    return (
      <div className='breadcrumbs__entry' key={index}>
        <div className='breadcrumb__entry__row'>
          { page.path && 
            <Fragment>
              <Link className='breadcrumbs__link' to={page.path}>
                {page.icon ? <page.icon className='breadcrumbs__icon'/> : <></>}
                {page.text}
              </Link>
              { index < pages.length - 1 && <span className='breadcrumbs__separator'>/</span> }
            </Fragment>
          }
          {
            !page.path &&
            <Fragment>
              {page.icon ? <page.icon className='breadcrumbs__icon'/> : <></>}
              <div className='breadcrumbs__currentPage'>{page.text}</div>
            </Fragment>
          }
        </div>
      </div>
    );
  });
};

 /**
  * Navigation breadcrumbs
  */
export const Breadcrumbs = withRouter(BreadcrumbsBase);