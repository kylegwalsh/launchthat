import * as React from 'react';
import Slider from 'react-slide-out';
// tslint:disable-next-line: no-submodule-imports
import 'react-slide-out/lib/index.css';
// tslint:disable-next-line: no-submodule-imports
import { MdClear } from 'react-icons/md';
import './SlidingPane.scss';

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to pane
   */
  className?: string;
  /**
   * title to display at the top of the pane
   */
  title?: string;
  /**
   * whether the sliding pane is currently open
   */
  isOpen: boolean;
  /**
   * function that allows the sliding pane to close itself (uses setIsOpen(false))
   */
  setIsOpen: (arg0: boolean) => void;
  /**
   * any children that should be rendered inside of the sliding pane
   */
  children?: React.ReactNode;
}

/** 
 * A pane that slides out from different sides
 */
export const SlidingPane = (props: IProps) => {
  return (
    <div className={`slidingPane ${(props.className && props.className) ? props.className : ''}`}>
      <Slider
        isOpen={ props.isOpen }
        onOutsideClick={() => props.setIsOpen(false)}
      >
        <div className='slidingPane__header'>
          <MdClear className='slidingPane__close' onClick={() => props.setIsOpen(false)}/>
          <h2 className='slidingPane__title'>{props.title}</h2>
        </div>
        <div className='slidingPane__content'>
          {props.children}
        </div>
      </Slider>
    </div>
  );
};