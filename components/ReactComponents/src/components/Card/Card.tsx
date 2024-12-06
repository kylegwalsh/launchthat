import * as React from 'react';
import { Card as MaterialCard, CardContent } from '@material-ui/core';
import './Card.scss';

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
   * any components wrapped by the card
   */
  children?: React.ReactNode;
  /**
   * whether to add padding inside the card
   */
  pad?: boolean;
}

/** 
 * A card component
 */
export const Card = (props: IProps) => {
  return (
    <MaterialCard className={`card ${(props.className && props.className.container) ? props.className.container : ''}`}>
      { // Add padding if requested
        props.pad &&
        <CardContent className={`${(props.className && props.className.content) ? props.className.content : ''}`}>
          {props.children}
        </CardContent>
      }
      {
        // Default to no paddding
        !props.pad &&
        <div className={`${(props.className && props.className.content) ? props.className.content : ''}`}>
          {props.children}
        </div>
      }
    </MaterialCard>
  );
};