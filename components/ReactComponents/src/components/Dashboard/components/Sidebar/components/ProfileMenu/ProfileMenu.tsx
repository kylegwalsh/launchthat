import * as React from 'react';
import { DropDown } from '../../../../../';
import { Avatar } from '@material-ui/core';
// tslint:disable-next-line: no-submodule-imports
import { MdArrowDropDown, MdSettings, MdPerson, MdExitToApp } from 'react-icons/md';
import './ProfileMenu.scss';

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * information about currently logged in user
   */
  user?: {
    /**
     * user's first name
     */
    firstName: string;
    /**
     * user's last name
     */
    lastName: string;
    /**
     * path to user image
     */
    picture?: string;
  };
  /**
   * the size of the sidebar (normal or mini)
   */
  size?: 'normal' | 'mini';
  /**
   * function to sign user out
   */
  signOut: () => void;
  /**
   * the options to render in the profile menu popup
   */
  profileOptions?: {
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
 * Profile menu that appears at the top of the side bar
 */
export const ProfileMenu = (props: IProps) => {
  // Define ref for drop down
  let dropDownRef: any;

  // Generate options for dropdown
  const options = props.profileOptions ? 
  // Use provided options and include signout
  [
    ...props.profileOptions,
    {
      icon: MdExitToApp,
      text: 'Sign Out',
      action: () => props.signOut(),
    },
  ] :
  // Use default options if none are provided
  [
    {
      icon: MdSettings,
      text: 'Account Settings',
      action: () => window.open('https://myaccount.google.com/', '_blank'),
    },
    {
      icon: MdExitToApp,
      text: 'Sign Out',
      action: () => props.signOut(),
    },
  ];
 
  return (
    <div>
      {/* Visible profile element */}
      <div
        className={`profileMenu ${props.className ? props.className : ''} ${props.size === 'mini' ? 'mini' : ''}`}
        onClick={(e) => dropDownRef.toggleMenu(e)}
      >
        <Avatar
          alt='...'
          src={props.user ? props.user.picture : undefined}
          className={`profileMenu__avatar ${props.size === 'mini' ? 'mini' : ''}`}
        >
          { // If no image is supplied, just use an icon
            (!props.user || !props.user.picture) &&
            <MdPerson/>
          }
        </Avatar>
        { // Only render name if the sidebar is not mini
          props.size !== 'mini' &&
          <div className='profileMenu__details'>
            <h4 className='profileMenu__username ellipsis'>
              {props.user ? `${props.user.firstName} ${props.user.lastName}` : undefined}
            </h4>
            <MdArrowDropDown className='profileMenu__arrow'/>
          </div>
        }
      </div>
      {/* Pop up menu */}
      <DropDown options={options} ref={(ref) => dropDownRef = ref}/>
    </div>
  );
};