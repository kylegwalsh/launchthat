import * as React from 'react';
const { useState, useEffect } = React; 
import { Input, Button, Select } from '../../../../../';
import './WordFilter.scss';

const wordOptions = [
  {
    value: 'contains',
    label: 'Contains',
  },
  {
    value: 'equals',
    label: 'Equals',
  },
  {
    value: 'notContain',
    label: 'Does not contain',
  },
  {
    value: 'isBlank',
    label: 'Is blank',
  },
  {
    value: 'notBlank',
    label: 'Is not blank',
  },
];

interface IProps {
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

export const WordFilter = (props: IProps) => {
  const [ filterText, setFilterText ] = useState('');
  const [ filterOption, setFilterOption ] = useState(wordOptions[0].value);

  /**
   * Check for previous filter on rerender
   */
  useEffect(() => {
    for (const filter in props.filters) {
      // If the filter key equals the column name set the values
      if (filter === props.columnName) {
        setFilterText(props.filters[filter].value);
        setFilterOption(props.filters[filter].type);
      }
    }
  }, []);

  /**
   * Apply the filter to the table
   */
  const applyFilter = () => {
    if (filterText !== '' || filterOption === 'isBlank' || filterOption === 'notBlank'){
      props.applyFilter(filterOption, filterText, props.columnName, props.columnLabel, props.filters, props.setFilter);
    }
    props.closeFilter();
  };

  /**
   * Clear the filter with the props that it was passed and in the local filter
   */
  const clearFilter = () => {
    setFilterText('');
    setFilterOption('');
    props.clearFilter(props.columnName, props.filters, props.setFilter);
    props.closeFilter();
  };

  /**
   * Set the filter text
   * @param event - The event pass by the input field
   */
  const setText = (event: any) => {
    setFilterText(event.target.value);
  };

  return (
    <div className={`column align-center wordFilter__column`}>
      <Select 
          onChange={(value) => setFilterOption(value)} 
          className={{ container: `wordFilter__select` }} 
          value={filterOption}
          options={wordOptions}
      />
      <Input
        disabled={filterOption === 'isBlank' || filterOption === 'notBlank'} 
        value={filterText} 
        onChange={(event) => setText(event)} 
        className={{ container: 'wordFilter__input m-t-0' }}
      />
      <div className={`row wordFilter__buttonRow`}>
        <Button onClick={applyFilter} className={'wordFilter__button m-l-0'}>
          Apply
        </Button>
        <Button onClick={clearFilter} className={'wordFilter__button m-r-0'}>
          Clear
        </Button>
      </div>
    </div>
  );
};