/// <reference types="react" />
import './GoogleButton.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * function that runs when google sign in is successful
     */
    handleSuccess: (arg0: any) => void;
    /**
     * function that runs when google sign in fails
     */
    handleFailure: (arg0: any) => void;
    /**
     * google api client key for single sign on (make sure your app URL is approved by the app)
     */
    clientId: string;
    /**
     * the type of access requested (use 'offline' to get an auth code)
     */
    accessType?: 'online' | 'offline';
    /**
     * the type of response being requested (use 'code' to get an auth code)
     */
    responseType?: string;
    /**
     * the scope of the access the user will be granting
     */
    scope?: string;
}
/**
 * A google login button
 */
export declare const GoogleButton: (props: IProps) => JSX.Element;
export {};
