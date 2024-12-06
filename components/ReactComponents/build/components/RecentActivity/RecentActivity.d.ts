import * as React from 'react';
import './RecentActivity.scss';
/**
 * Defines the activity structure
 */
interface IActivity {
    /**
     * icon used to represent category
     */
    icon: React.ReactNode;
    /**
     * color to show behind icon
     */
    color: string;
    /**
     * name of the row edited
     */
    name: string;
    /**
     * category of the row edited
     */
    category: string;
    /**
     * link to the activities page in the system
     */
    link: string;
    /**
     * date the row was edited
     */
    date: Date;
    /**
     * the name of the user that edited the row
     */
    editor: string;
    /**
     * the action performed on the row
     */
    action: 'create' | 'update' | 'delete';
}
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * object containing classNames
     */
    className?: {
        /**
         * className applied to container
         */
        container?: string;
        /**
         * className applied to inner content
         */
        content?: string;
    };
    /**
     * array of activities
     */
    activities?: IActivity[];
}
/**
 * Component showing recent dashboard activity (changes to DB)
 */
export declare const RecentActivity: (props: IProps) => JSX.Element;
export {};
