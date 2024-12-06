/// <reference types="react" />
import './ProgressBar.scss';
import 'rc-progress/assets/index.css';
interface IProps {
    className?: string;
    /**
     * the percent of the progress bar
     */
    percent: number;
    /**
     * the color of the progress bar
     */
    color?: string;
    /**
     * the width of the progress bar
     */
    width?: number;
    /**
     * the edges of the progress bar
     */
    caps?: 'square' | 'round' | 'butt';
}
/**
 * A progress bar used to show loading state
 */
export declare const ProgressBar: (props: IProps) => JSX.Element;
export {};
