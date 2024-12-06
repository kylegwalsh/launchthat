/// <reference types="react" />
import 'react-slide-out/lib/index.css';
import './AppTile.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to pane
     */
    className?: string;
    /**
     * name of the app
     */
    name: string;
    /**
     * relative path to the image in the public file
     */
    img: string;
    /**
     * url of the app
     */
    url: string;
}
/**
 * A pane that slides out from different sides
 */
export declare const AppTile: (props: IProps) => JSX.Element;
export {};
