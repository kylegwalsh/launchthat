import * as React from 'react';
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
export declare const ProfileMenu: (props: IProps) => JSX.Element;
export {};
