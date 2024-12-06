import * as React from 'react';
import { RadioGroup, FormControlLabel, FormControl } from '@material-ui/core';
import { Label, Radio } from '../';
import './RadioList.scss';

/**
 * Defines expected fields for each option
 */
interface IOption {
  /**
   * label to show for radio
   */
  label: string;
   /**
    * value of radio
    */
  value: string;
}

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * object of classNames applied to component
   */
  className?: {
    root?: string;
    radio?: string;
    radioGroup?: string;
    formControl?: string;
  };
  /**
   * The possible values of the radio button group
   */
  options: IOption[];
  /**
   * The current value selected in the radio button group
   */
  value?: string;
  /**
   * The label of the radio button group
   */
  label?: string;
  /**
   * A Function to handle the change of the radio button group
   */
  onChange: (event: any) => void;
  /**
   * Determines whether or not the radio list is disabled
   */
  disabled?: boolean;
}

/**
 * A list of radio buttons
 */
export const RadioList = (props: IProps) => {
  /**
   * Generate a list of radios
   */
  const generateList = () => {
    return props.options.map((option, index) => {
      return (
          <FormControlLabel
            label={option.label}
            key={index}
            value={option.value}
            control={
              <Radio
                className={`${props.className && props.className.radio ? props.className.radio : ''}`}
                checked={props.value === option.value}
                value={option.value}
                disabled={props.disabled}
              />
            }
          />
      );
    });
  };

  return (
    <FormControl
      // @ts-ignore
      component='fieldset'
      className={`radioList ${props.className && props.className.formControl ? props.className.formControl : ''}`}
    >
      { props.label && <Label text={props.label}/> }
      <RadioGroup
        className={`radioList__radioGroup ${props.className && props.className.radioGroup ? props.className.radioGroup : ''}`}
        value={props.value}
        onChange={props.onChange}
      >
        {generateList()}
      </RadioGroup>
    </FormControl>
  );
};