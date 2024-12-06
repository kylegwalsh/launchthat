import * as React from 'react';
import './Button.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * function to run when button is clicked
     */
    onClick: (...args: any[]) => any;
    /**
     * whether the button is disabled or not
     */
    disabled?: boolean;
    /**
     * any nested text or components to render inside the button
     */
    children?: React.ReactNode;
}
/**
 * A basic button
 */
export declare const Button: (props: IProps) => JSX.Element;
export {};
