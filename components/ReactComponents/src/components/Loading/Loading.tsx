import * as React from 'react';
import * as spinner from './assets/spinner.gif';
import './Loading.scss';

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * size loading gif should be
   */
  size?: 'large' | 'med' | 'small';
}

/** 
 * A component that displays a full size spinner
 */
export const Loading = (props: IProps) => {
  const size = getSize(props.size);

  return (
    <div className='loading__container'>
      <img
        // @ts-ignore
        src={spinner}
        style={{ height: size, width: size }}
        className={`loading__img ${props.className ? props.className : ''}`}
      />
    </div>
  );
};

// HELPERS

/**
 * Get a pixel size based on a string size
 */
const getSize = (size: 'large' | 'med' | 'small' | undefined) => {
  switch (size) {
  case 'large':
    return '6em';
  case 'med':
    return '4em';
  case 'small':
    return '2em';
  default:
    return '6em';
  }
};