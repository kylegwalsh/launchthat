import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './Breadcrumbs.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * a list of pages to link to from the breadcrumbs
     */
    pages: {
        /**
         * the icon to show next to the crumb
         */
        icon?: React.ReactNode;
        /**
         * the relative path that should be linked to (optional)
         */
        path?: string;
        /**
         * the text to show as the crumb
         */
        text: string;
    }[];
}
/**
 * Navigation breadcrumbs
 */
export declare const Breadcrumbs: React.ComponentClass<Pick<IProps & RouteComponentProps<{}, import("react-router").StaticContext, any>, "className" | "pages">, any>;
export {};
