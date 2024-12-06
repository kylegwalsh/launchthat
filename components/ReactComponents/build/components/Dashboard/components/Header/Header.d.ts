import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './Header.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * other header components that should be rendered (supplied by dashboard)
     */
    otherComponents?: React.ReactNode;
    /**
     * relative path to header logo in public folder
     */
    logo: string;
    /**
     * the default route of the dashboard
     */
    defaultRoute?: string;
}
/**
 * The header of the dashboard
 */
export declare const Header: React.ComponentClass<Pick<IProps & RouteComponentProps<{}, import("react-router").StaticContext, any>, "className" | "otherComponents" | "logo" | "defaultRoute">, any>;
export {};
