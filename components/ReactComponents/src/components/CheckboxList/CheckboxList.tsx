import * as React from 'react';
const { useState, useEffect } = React;
import { FormGroup, FormControl, FormControlLabel } from '@material-ui/core';
import { Label, Checkbox, Chip } from '../';
// tslint:disable-next-line: no-submodule-imports
import { MdKeyboardArrowDown } from 'react-icons/md';
import './CheckboxList.scss';

/**
 * Defines expected fields in each value
 */
interface IValues {
  /**
   * a value that determines whether the current box is checked
   */
  checked: boolean;
  /**
   * the value of the current box
   */
  value: string;
  /**
   * label for option
   */
  label: string;
  /**
   * an optional chip to render in the row
   */
  chip?: {
    /**
     * the type of chip
     */
    type: 'success' | 'warning' | 'danger' | 'default';
    /**
     * the text of the chip
     */
    label: string;
  };
  /**
   * an optional row to render with the item in the list
   */
  row?: React.ReactNode;
}

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * classNames to apply to different components
   */
  className?: {
    checkBox?: string;
    row?: string;
    formControl?: string;
  };
  /**
   * an array of value objects that handle the check boxes
   */
  values: IValues[];
  /**
   * the label given to the checkbox group
   */
  label?: string;
  /**
   * the function to run when the check boxes change
   */
  onChange: (event: any) => void;
  /**
   * determines whether the check boxes should be styled like radios
   */
  radioStyle?: boolean;
  /**
   * A boolean to determine whether or not the checkbox should be disabled
   */
  disabled?: boolean;
}

/**
 * A list of check boxes
 */
export const CheckboxList = (props: IProps) => {
  // Track which rows are open (if they even exist)
  const [rowsOpen, setRowsOpen] = useState<boolean[]>([]);

  /**
   * Initialize row state when component mounts
   */
  useEffect(() => {
    // New row tracking object
    const newRowsOpen: boolean[] = [];

    // Initialize array of closed rows (insert false)
    props.values.forEach((value) => {
      newRowsOpen.push(false);
    });

    // Set state
    setRowsOpen(newRowsOpen);
  }, []);

  /**
   * Function to change open state of each item's row
   * @param index - index of row that was clicked
   */
  const onRowClick = (index: number) => {
    // New row tracking object
    const newRowsOpen = rowsOpen.slice();

    // Change row's open state
    newRowsOpen[index] = !newRowsOpen[index];

    // Update state
    setRowsOpen(newRowsOpen);
  };

  /**
   * Generate list of check boxes
   */
  const generateList = () => {
    return props.values.map((value, index) => {
      return (
        <div key={index} className='checkboxList__columnWrapper'>
          <div className={`checkboxList__rowWrapper ${props.className && props.className.row ? props.className.row : ''}`}>
            <FormControlLabel
              label={value.label}
              control={
                <Checkbox
                  radioStyle={props.radioStyle}
                  className={`${props.className && props.className.checkBox ? props.className.checkBox : ''}`}
                  checked={value.checked}
                  onChange={props.onChange}
                  value={value.value}
                  disabled={props.disabled}
                />
              }
            />
            <div className='checkboxList__right'>
              { // Inject chip if it's provided
                value.chip &&
                <Chip className={'checkboxList__chip'} type={value.chip.type} label={value.chip.label}/>
              }
              { // If the checkbox includes a row, and our row state has been initialized, show the row icon
                value.row && rowsOpen.length &&
                <MdKeyboardArrowDown
                  className={`checkboxList__arrow checkboxList__arrow--${rowsOpen[index] ? 'open' : 'closed'}`}
                  onClick={() => onRowClick(index)}
                />
              }
            </div>
          </div>
          {/* Hidden row for possible expandable rows */}
          <div className={`checkboxList__expandableRow checkboxList__expandableRow--${rowsOpen[index] ? 'open' : 'closed'}`}>
            {props.values[index].row}
          </div>
        </div>
      );
    });
  };

  return (
    <div>
        <FormControl 
          component='div'
          className={`checkboxList ${props.className && props.className.formControl ? props.className.formControl : ''} formControl`}
        >
          { props.label && <Label text={props.label}/> }
          <FormGroup>
            {generateList()}
          </FormGroup>
        </FormControl>
    </div>
  );
};