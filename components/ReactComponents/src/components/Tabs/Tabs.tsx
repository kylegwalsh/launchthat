import * as React from 'react';
import { Card } from '../';
import { withRouter, Link, RouteComponentProps } from 'react-router-dom';
import './Tabs.scss';

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: {
    container?: string;
    content?: string;
  };
  /**
   * the tabs to show in the navigation
   */
  tabs: {
    path: string;
    text: string;
    active?: boolean;
  }[];
}

/**
 * A tabbed navigation that appears in a card
 */
const TabsBase = (props: IProps & RouteComponentProps) => {
  return (
    <Card 
      className={{ 
        container: `tabs__container ${props.className && props.className.container ? props.className.container : ''}`,
        content: `tabs__content ${props.className && props.className.content ? props.className.content : ''}`,
      }}
    >
      { generateTabs(props.tabs) }
    </Card>
  );
};

/**
 * Generate the tabs that appear in the navigation
 */
const generateTabs = (tabs: IProps['tabs']) => {
  return tabs.map((tab, index) => {
    return ( 
      <Link
        key={index}
        to={tab.path}
        className={`tabs__tab ${tab.active ? 'active' : ''}`}
      >
        {tab.text}
      </Link>
    );
  });
};

/**
 * A tabbed navigation that appears in a card
 */
export const Tabs = withRouter(TabsBase);