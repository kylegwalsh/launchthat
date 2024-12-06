import * as React from 'react';
import { Card, IconCircle } from '../../components';
import { Link } from 'react-router-dom';
import { Date } from '../../utilities';
import './RecentActivity.scss';

/**
 * Defines the activity structure
 */
interface IActivity {
  /**
   * icon used to represent category
   */
  icon: React.ReactNode;
  /**
   * color to show behind icon
   */
  color: string;
  /**
   * name of the row edited
   */
  name: string;
  /**
   * category of the row edited
   */
  category: string;
  /**
   * link to the activities page in the system
   */
  link: string;
  /**
   * date the row was edited
   */
  date: Date;
  /**
   * the name of the user that edited the row
   */
  editor: string;
  /**
   * the action performed on the row
   */
  action: 'create' | 'update' | 'delete';
}

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * object containing classNames
   */
  className?: {
    /**
     * className applied to container
     */
    container?: string;
    /**
     * className applied to inner content
     */
    content?: string;
  };
  /**
   * array of activities
   */
  activities?: IActivity[];
}

/** 
 * Component showing recent dashboard activity (changes to DB)
 */
export const RecentActivity = (props: IProps) => {
  return (
    <Card
      pad
      className={{ 
        container: `${(props.className && props.className.container) ? props.className.container : ''}`,
        content: `${(props.className && props.className.content) ? props.className.content : ''}`,
      }}
    >
      <h3>Recent Activity</h3>
      {generateActivity(props.activities)}
    </Card>
  );
};

// HELPERS

/**
 * Generates rows for each recent activity
 * @param activities - array of recent activities
 */
const generateActivity = (activities: IActivity[] | undefined) => {
  if (activities && activities.length) {
    return activities.map((activity: IActivity, index: number) => {
      return(
        <div key={index} className='recentActivity__row row'>
          <div className='recentActivity__iconContainer'>
            <IconCircle color={activity.color} icon={activity.icon} className='recentActivity__icon'/>
          </div>
          <div className='recentActivity__information column'>
            <span className='recentActivity__information__row row'>
              <Link to={activity.link} className='recentActivity__link'>{activity.name}</Link> 
              {getAction(activity.action)} {activity.category} by {activity.editor}
            </span>
            <span className='row recentActivity__date'>{Date.formatDate(activity.date)}</span>
          </div>
        </div>
      );
    });
  }
  else return;
};

/**
 * Gets the text shown to user based on action
 * @param action - action performed on the row
 * @returns
 * @param {string} actionText - ui text for action
 */
const getAction = (action: string) => {
  switch (action) {
  case 'create':
    return 'added to';
  case 'update':
    return 'edited in';
  case 'delete':
    return 'deleted from';
  default:
    return 'modified in';
  }
};