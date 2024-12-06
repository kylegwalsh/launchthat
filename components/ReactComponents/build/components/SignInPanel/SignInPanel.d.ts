/// <reference types="react" />
import './SignInPanel.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * relative url path to logo in public folder
     */
    logo: string;
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
 * A panel allowing the user to sign in using their google information
 */
export declare const SignInPanel: (props: IProps) => JSX.Element;
export {};
