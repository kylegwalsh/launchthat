import * as React from 'react';
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
export declare const DropDown: React.ForwardRefExoticComponent<IProps & React.RefAttributes<{}>>;
export {};
