import * as React from 'react';
const { useState, useEffect } = React; 
import { Input, Button, Select } from '../../../../../';
import './NumberFilter.scss';

const numberOptions = [
  {
    value: '=',
    label: 'Equals',
  },
  {
    value: '!=',
    label: 'Does not equal',
  },
  {
    value: '>',
    label: 'Greater than',
  },
  {
    value: '>=',
    label: 'Greater than or equal to',
  },
  {
    value: '<',
    label: 'Less than',
  },
  {
    value: '<=',
    label: 'Less than or equal to',
  },
  {
    value: 'between',
    label: 'Between',
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
  /**
   * A prop that determines if a filter should only be an equals filter
   */
  equals?: boolean;
}

export const NumberFilter = (props: IProps) => {
  const [ filterText, setFilterText ] = useState('');
  const [ filterTextBetween, setFilterTextBetween ] = useState('');
  const [ filterOption, setFilterOption ] = useState(numberOptions[0].value);

  /**
   * Set filter if there is a previous filter
   */
  useEffect(() => {
    for (const filter in props.filters) {
      // Check if column name equals the filter key and set values
      if (filter === props.columnName) {
        // If the filter type is between handle the special case by splitting the
        // value on the comma
        if (props.filters[filter].type === 'between') {
          const split = props.filters[filter].value.split(',');
          setFilterOption(props.filters[filter].type);
          setFilterText(split[0]);
          setFilterTextBetween(split[1]);
        } else {
          setFilterOption(props.filters[filter].type);
          setFilterText(props.filters[filter].value);
        }
      }
    }
  }, []);

  /**
   * Apply the filter to the table
   */
  const applyFilter = () => {
    if (filterText !== '' && filterOption !== 'between') {
      props.applyFilter(filterOption, filterText, props.columnName, props.columnLabel, props.filters, props.setFilter);
    } else if (filterText !== '' && filterOption === 'between' && filterTextBetween !== '') {
      const text = filterText + ',' + filterTextBetween;
      props.applyFilter(filterOption, text, props.columnName, props.columnLabel, props.filters, props.setFilter);
    }
    props.closeFilter();
  };

  /**
   * Clear the filter from the filter and the table
   */
  const clearFilter = () => {
    setFilterText('');
    setFilterOption('');
    props.clearFilter(props.columnName, props.filters, props.setFilter);
    props.closeFilter();
  };

  /**
   * Set the text for the filter only if the value is a number
   */
  const setText = (event: any) => {
    if (/^-?\d*\.?\d*$/.test(event.target.value)) setFilterText(event.target.value);
  };

  /**
   * Set the text for the between filter if that's the selected option
   */
  const setTextBetween = (event: any) => {
    if (/^-?\d*\.?\d*$/.test(event.target.value)) setFilterTextBetween(event.target.value);
  };

  return (
    <div className={`column align-center numberFilter__column`}>
      <Select 
          onChange={(value) => setFilterOption(value)} 
          className={{ container: `numberFilter__select` }} 
          value={filterOption}
          disabled={props.equals}
          options={ props.equals ? [numberOptions[0]] : numberOptions}
      />
      <Input 
        placeholder={filterOption === 'between' ? 'start' : ''}
        value={filterText} 
        onChange={(event) => setText(event)} 
        className={{ container: 'numberFilter__input m-t-0' }}
      />
      {
      (filterOption === 'between') &&
      <Input 
        placeholder={'end'} 
        value={filterTextBetween} 
        onChange={(event) => setTextBetween(event)} 
        className={{ container: 'numberFilter__input m-t-0' }}
      />
      }
      <div className={`row numberFilter__buttonRow`}>
        <Button onClick={applyFilter} className={'numberFilter__button m-l-0'}>
          Apply
        </Button>
        <Button onClick={clearFilter} className={'numberFilter__button m-r-0'}>
          Clear
        </Button>
      </div>
    </div>
  );
};