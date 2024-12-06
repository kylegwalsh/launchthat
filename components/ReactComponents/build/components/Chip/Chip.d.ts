/// <reference types="react" />
import './Chip.scss';
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * label to show for the chip
     */
    label: string;
    /**
     * type of chip to show (determines color)
     */
    type: 'success' | 'warning' | 'danger' | 'default';
}
export declare const Chip: (props: IProps) => JSX.Element;
export {};
