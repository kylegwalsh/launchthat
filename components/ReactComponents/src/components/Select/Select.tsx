import * as React from 'react';
import { ErrorText, Label } from '../';
import ReactSelect from 'react-select';
import '../Input/Input.scss';
import './Select.scss';

/**
 * Defines expected props for options
 */
interface IOption {
  /**
   * visible value for option
   */
  label: string;
  /**
   * actual value for option
   */
  value?: any;
}

/**
 * Defines expected props for ReactSelect options
 */
interface IReactSelectOption {
  /**
   * visible value for option
   */
  label: string;
  /**
   * actual value for option
   */
  value?: any;
  /**
   * nested options
   */
  options?: IOption[];
}

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
   * array of options to display in the select
   */
  options: IReactSelectOption[];
  /**
   * error message
   */
  error?: string | undefined;
  /**
   * function to update value when it changes
   */
  onChange?: (...args: any[]) => any;
  /**
   * label to show with input
   */
  label?: string;
  /**
   * whether the input is disabled
   */
  disabled?: boolean;
  /**
   * whether to automatically focus on input when it appears
   */
  autoFocus?: boolean;
  /**
   * whether the input is required to proceed
   */
  required?: boolean;
  /**
   * whether the select should be searchable
   */
  search?: boolean;
  /**
   * whether to allow selection of multiple values
   */
  multi?: boolean;
  /**
   * function to run when input is blurred
   */
  onBlur?: (...args: any[]) => any;
  /**
   * placeholder for input
   */
  placeholder?: string;
}

/**
 * A select input
 */
export const Select = (props: IProps) => {
  let selectedOption;

  // If a value is selected, determine which option it matches
  if (props.value) {
    for (let i = 0; i < props.options.length; i++) {
      if (props.options[i].value === props.value) {
        selectedOption = props.options[i];
        break;
      }
    }
  }

  /**
   * Return value to onChange function
   * @param option - the option from the select component
   */
  const onChange = (option: { label: string; value: string; }) => {
    if (props.onChange) props.onChange(option.value);
  };

  return (
    <div className={`input__container ${(props.className && props.className.container) ? props.className.container : ''}`}>
      { // If a label is provided, show it
        props.label &&
        <Label text={props.label} required={props.required} />
      }
      <ReactSelect
        className={`
          select
          ${(props.className && props.className.input) ? props.className.input : ''}
          ${props.error ? 'error' : ''}
        `}
        value={selectedOption}
        // @ts-ignore
        onChange={onChange}
        isDisabled={props.disabled}
        autoFocus={props.autoFocus}
        options={props.options}
        isSearchable={props.search}
        isMulti={props.multi}
        inputId={props.id}
        onBlur={props.onBlur}
        classNamePrefix='select'
        placeholder={props.placeholder}
      />
      { // If an error is provided, show it
        props.error &&
        <ErrorText text={props.error}/>
      }
    </div>
  );
};