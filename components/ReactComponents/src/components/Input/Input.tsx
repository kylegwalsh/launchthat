import * as React from 'react';
import { Label, ErrorText } from '../';
// tslint:disable-next-line: no-submodule-imports
import { MdInfoOutline } from 'react-icons/md';
import './Input.scss';

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
     * className applied to actual input
     */
    input?: string;
  };
  /**
   * optional id for identifying html via selector
   */
  id?: string;
  /**
   * value for input
   */
  value: any;
  /**
   * error message
   */
  error?: string | undefined;
  /**
   * function to update value when it changes
   */
  onChange?: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
  /**
   * label to show with input
   */
  label?: string;
  /**
   * placeholder for input
   */
  placeholder?: string;
  /**
   * whether the input should be read only (no input changing)
   */
  readOnly?: boolean;
  /**
   * whether the input is disabled
   */
  disabled?: boolean;
  /**
   * maximum number of character
   */
  maxLength?: number;
  /**
   * whether to autocomplete the users input
   */
  autoComplete?: string;
  /**
   * whether to automatically focus on input when it appears
   */
  autoFocus?: boolean;
  /**
   * whether the input is required to proceed
   */
  required?: boolean;
  /**
   * type of input (email, etc)
   */
  type?: string;
  /**
   * info to display when hovering over info icon
   */
  info?: string;
  /**
   * function to run when input is blurred
   */
  onBlur?: (...args: any[]) => any;
}

/** 
 * An input component
 */
export const Input = (props: IProps) => {
  return (
    <div className={`input__container ${(props.className && props.className.container) ? props.className.container : ''}`}>
      { // If a label is provided, show it
        props.label &&
        <Label text={props.label} required={props.required}/>
      }
      <div className='input__innerContainer'>
        <input 
          id={props.id}
          className={`
            input
            ${(props.className && props.className.input) ? props.className.input : ''}
            ${props.error ? 'error' : ''}
            ${props.info ? 'input__infoApplied' : ''}
          `}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          readOnly={props.readOnly}
          disabled={props.disabled}
          maxLength={props.maxLength}
          autoComplete={props.autoComplete === 'off' ? 'new-password' : props.autoComplete}
          autoFocus={props.autoFocus}
          required={props.required}
          onBlur={props.onBlur}
          type={props.type}
        />
        { // Render info helper
          props.info &&
          <span className='input__infoWrapper' data-tip={props.info}>
            <MdInfoOutline className='input__info' />
          </span>
        }
      </div>
      { // If an error is provided, show it
        props.error &&
        <ErrorText text={props.error}/>
      }
    </div>
  );
};