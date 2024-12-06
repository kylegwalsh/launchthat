import * as React from 'react';
import './Card.scss';
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
     * any components wrapped by the card
     */
    children?: React.ReactNode;
    /**
     * whether to add padding inside the card
     */
    pad?: boolean;
}
/**
 * A card component
 */
export declare const Card: (props: IProps) => JSX.Element;
export {};
