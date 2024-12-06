import * as React from 'react';
const { useState, forwardRef, useImperativeHandle } = React;
import { Menu, MenuItem } from '@material-ui/core';
import './DropDown.scss';

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * the options to render in the drop down menu
   */
  options: {
    /**
     * the icon to show next to the text
     */
    icon?: React.ReactNode;
    /**
     * the text to show for each options
     */
    text: string;
    /**
     * the action to perform when clicking the option
     */
    action: (...args: any[]) => void;
  }[];
}

/**
 * A dropdown menu component
 */
export const DropDown = forwardRef((props: IProps, ref: any) => {
  // Track anchor element (whatever is clicked)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  /**
   * Toggle the profile menu open / closed
   */
  const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Close the menu
   */
  const handleClose = (setAnchorEl: (arg0: HTMLElement | null) => void) => {
    setAnchorEl(null);
  };

  // Pass ref back up
  useImperativeHandle(ref, () => ({
    toggleMenu(event: React.MouseEvent<HTMLElement>) {
      toggleMenu(event);
    },
  }), [anchorEl]);

  const renderOptions = (options: IProps['options']) => {
    // If no options are provided, just return
    if (!options) return;
    // Otherwise, render the options
    return options.map((option: any, i: number) => {
      return (
        <MenuItem 
          key={i}
          onClick={() => {
            option.action();
            handleClose(setAnchorEl);
          }}
        >
          <a>
            {option.icon ? <option.icon className='dropDown__Icon'/> : <></>}
            {option.icon ? ` ${option.text}` : option.text}
          </a>
        </MenuItem>
      );
    });
  };

  return (
    <Menu
      className={`dropDown ${props.className ? props.className : ''}`}
      id='simple-menu'
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={() => handleClose(setAnchorEl)}
      PaperProps={{
        style: {
          width: 120,
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}
    >
      { renderOptions(props.options) }
    </Menu>
  );
});