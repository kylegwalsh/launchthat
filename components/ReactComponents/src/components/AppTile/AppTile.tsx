import * as React from 'react';
// tslint:disable-next-line: no-submodule-imports
import 'react-slide-out/lib/index.css';
import './AppTile.scss';

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to pane
   */
  className?: string;
  /**
   * name of the app
   */
  name: string;
  /**
   * relative path to the image in the public file
   */
  img: string;
  /**
   * url of the app
   */
  url: string;
}

/** 
 * A pane that slides out from different sides
 */
export const AppTile = (props: IProps) => {
  return (
    <a className={`appTile ${(props.className && props.className) ? props.className : ''}`} href={props.url} target='_blank'>
      <img src={props.img} className='appTile__img'/>
      <p className='appTile__name'>{props.name}</p>
    </a>
  );
};