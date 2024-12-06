import * as React from 'react';
import './SearchBox.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * object containing classNames
     */
    className?: {
        /**
         * className applied to input
         */
        input?: string;
        /**
         * className applied to container
         */
        container?: string;
        /**
         * className applied to button
         */
        button?: string;
    };
    /**
     * input placeholder
     */
    placeholder?: string;
    /**
     * function handling update of input value when value changes
     */
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    /**
     * function handling submission of search
     */
    onSubmit: (event: React.MouseEvent<HTMLElement>) => void;
    /**
     * value of input (updated in onChange)
     */
    value: string;
}
/**
 * A generic search box
 */
export declare const SearchBox: (props: IProps) => JSX.Element;
export {};
