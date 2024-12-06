import * as React from 'react';
import { IRoute } from '../../../';
import './Sidebar.scss';
import { RouteComponentProps } from 'react-router-dom';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * possible routes for the app
     */
    routes: IRoute[];
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
        /**
         * whether the user is an admin
         */
        isAdmin?: boolean;
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
 * The sidebar of the dashboard
 */
export declare const Sidebar: React.ComponentClass<Pick<IProps & RouteComponentProps<{}, import("react-router").StaticContext, any>, "user" | "size" | "className" | "routes" | "signOut" | "profileOptions">, any>;
export {};
