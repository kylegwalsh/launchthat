import * as React from 'react';
import './ProgressBar.scss';
// tslint:disable-next-line: no-submodule-imports
import 'rc-progress/assets/index.css';
import { Line } from 'rc-progress';

interface IProps {
  className?: string;
  /**
   * the percent of the progress bar
   */
  percent: number;
  /**
   * the color of the progress bar
   */
  color?: string;
  /**
   * the width of the progress bar
   */
  width?: number;
  /**
   * the edges of the progress bar
   */
  caps?: 'square' | 'round' | 'butt';
}

/**
 * A progress bar used to show loading state
 */
export const ProgressBar = (props: IProps) => {
  return (
    <Line 
      strokeLinecap={props.caps}
      className={`progressBar ${props.className ? props.className : ''}`}
      percent={props.percent}
      color={props.color}
      strokeWidth={props.width}
    />
  );
};