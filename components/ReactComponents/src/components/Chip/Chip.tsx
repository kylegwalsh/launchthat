import * as React from 'react';
import './Chip.scss';
import { Chip as MaterialChip } from '@material-ui/core';

interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * label to show for the chip
   */
  label: string;
  /**
   * type of chip to show (determines color)
   */
  type: 'success' | 'warning' | 'danger' | 'default';
}

export const Chip = (props: IProps) => {
  return (
  <MaterialChip
    className={`chip chip--${props.type} ${props.className ? props.className : ''}`}
    label={props.label} 
  />
  );
};