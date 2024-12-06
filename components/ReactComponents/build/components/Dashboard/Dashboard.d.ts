import * as React from 'react';
import './Dashboard.scss';
/**
 * Defines the requirements of a route
 */
export interface IRoute {
    /**
     * the name of the route (shown in sidebar)
     */
    name: string;
    /**
     * the relative URL path the route is associated with
     */
    path: string;
    /**
     * an optional field that denotes whether this route is only intended for admins
     */
    adminOnly?: boolean;
    /**
     * whether the URL path must be an exact match to render the component (can be used
     * to render nested pages if turned off - ex. /links with exact match false would match /links and /links/2)
     */
    exact: boolean;
    /**
     * function to render component within dashboard body
     */
    render: () => React.ReactNode;
    /**
     * icon associated with route (shown in sidebar)
     */
    icon: React.ReactNode;
    /**
     * override the location where the sidebar button points (can be external)
     */
    overrideLink?: string;
    /**
     * whether to hide the route in the sidebar
     */
    hidden?: boolean;
}
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * components that are added to the right side of the header
     */
    headerComponents?: React.ReactNode;
    /**
     * any other elements you would like the dashboard to render at a global level (like a sliding pane)
     */
    dashboardComponents?: React.ReactNode;
    /**
     * possible routes for the app
     */
    routes: IRoute[];
    /**
     * relative path to header logo in public folder
     */
    headerLogo: string;
    /**
     * an optional route to redirect any incorrect URLs to
     */
    defaultRoute?: string;
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
     * specify the size of the sidebar (normal or mini)
     */
    sidebarSize?: 'normal' | 'mini';
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
 * The dashboard (includes sidebar and header).
 * Child component should be the central page of the dashboard
 * and controlled by a top level router
 */
export declare const Dashboard: (props: IProps) => JSX.Element;
export {};
