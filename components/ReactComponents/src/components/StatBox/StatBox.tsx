import * as React from 'react';
import { Card, IconCircle } from '../';
import './StatBox.scss';

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
   * name of value
   */
  name: string;
  /**
   * number value to show
   */
  value: string | number;
  /**
   * icon to show
   */
  icon: React.ReactNode;
  /**
   * background color for icon
   */
  color: string;
}

/** 
 * Component show cases a stat and icon for a category
 */
export const StatBox = (props: IProps) => {
  return (
    <Card
      pad 
      className={{ 
        container: `${(props.className && props.className.container) ? props.className.container : ''}`,
        content: `statBox__content row ${(props.className && props.className.content) ? props.className.content : ''}`,
      }}
    >
      <IconCircle icon={props.icon} color={props.color} className='statBox__icon'/>
      <div className='column'>
        <div className='row statBox__value'>{props.value}</div>
        <div className='row statBox__name'>{props.name}</div>
      </div>
    </Card>
  );
};