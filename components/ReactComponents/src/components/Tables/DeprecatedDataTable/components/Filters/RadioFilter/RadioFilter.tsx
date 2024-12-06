import * as React from 'react';
const { useState, useEffect } = React; 
import { Button, RadioList } from '../../../../..';
import './RadioFilter.scss';

/**
 * Defines expected fields in each value
 */
interface IOptions {
  /**
   * the value of the current box
   */
  value: string;
  /**
   * label for option
   */
  label: string;
}

interface IProps {
  /**
   * The values to supply the check box list in the filter
   */
  filterValues: IOptions[];
  /**
   * A function for used for closing the current filter when the user either clears the filters, or
   * applies the filters
   */
  closeFilter: () => void;
  /**
   * A apply filter function for applying the filter once the filter is selected
   */
  applyFilter: (
    type: string, value: string, columnName: string, columnLabel: string, filter: any, setFilter: (input: any) => void) => void;
  /**
   * A clear filter function for applying the filter once the filter is selected
   */
  clearFilter: (columnName: string, filter: any, setFilter: (input: any) => void) => void;
  /**
   * The name of the column to apply the filter to
   */
  columnName: string;
  /**
   * Column label for the visual aspect of the filter
   */
  columnLabel: string;
  /**
   * The filters for the table
   */
  filters: any;
  /**
   * The filters to apply to the custom filters
   */
  setFilter: (input: any) => void;
}

export const RadioFilter = (props: IProps) => {
  const [ filterValue, setFilterValue ] = useState('');

  /**
   * On the first filter render check if filters are applied
   */
  useEffect(() => {
    for (const filter in props.filters) {
      // If the filter key is equal to the column name set the value
      if (filter === props.columnName) {
        setFilterValue(props.filters[filter].value);
      }
    }
  }, []);

  /**
   * Handle change in values for 
   * @param value - value of endpoint clicked
   */
  const setValue = (value: string) => {
    // Initialize a new selection object
    setFilterValue(value);
  };

  /**
   * Apply the filter to the table with the right props
   */
  const applyFilter = () => {
    // Apply the final filter value if there is one
    if (filterValue.length) props.applyFilter('equals', filterValue,  props.columnName, props.columnLabel, props.filters, props.setFilter);
    props.closeFilter();
  };

  /**
   * Clear the filter from the table
   */
  const clearFilter = () => {
    props.clearFilter(props.columnName, props.filters, props.setFilter);
    props.closeFilter();
  };

  return (
    <div className={`column align-center radioFilter__column`}>
      <RadioList value={filterValue} className={{ radio: 'radioFilter__radio', formControl: 'radioFilter__checkboxList' }} onChange={(event) => setValue(event.target.value)} options={props.filterValues}/>
      <div className={`row radioFilter__buttonRow`}>
        <Button onClick={applyFilter} className={'radioFilter__button m-l-0'}>
          Apply
        </Button>
        <Button onClick={clearFilter} className={'radioFilter__button m-r-0'}>
          Clear
        </Button>
      </div>
    </div>
  );
};