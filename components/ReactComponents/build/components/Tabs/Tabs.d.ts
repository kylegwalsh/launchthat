import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './Tabs.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: {
        container?: string;
        content?: string;
    };
    /**
     * the tabs to show in the navigation
     */
    tabs: {
        path: string;
        text: string;
        active?: boolean;
    }[];
}
/**
 * A tabbed navigation that appears in a card
 */
export declare const Tabs: React.ComponentClass<Pick<IProps & RouteComponentProps<{}, import("react-router").StaticContext, any>, "className" | "tabs">, any>;
export {};
