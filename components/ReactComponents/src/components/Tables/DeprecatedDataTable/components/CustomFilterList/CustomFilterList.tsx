import * as React from 'react';
// const { useState } = React;
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';

const defaultFilterListStyles = {
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  displayNone: {
    display: 'none',
  },
  chip: {
    margin: '8px 8px 8px 0px',
  },
};

interface IProps {
  /** Extend the style applied to components */
  classes: any;
  // The function called to update the filter
  clearFilter: (columnName: string, filters: string, setFilter: (input: any) => void) => void;
  /**
   * The filters that the table should use for reseting the filters
   */
  filters: any;
  /**
   * The set filter function to start the filter
   */
  setFilter: (input: any) => any;
}

// tslint:disable-next-line: variable-name
const _CustomFilterList = (props: IProps) => {
  const { classes, filters, clearFilter } = props;
  return (
    <div className={classes.root}>
      {
        // Loop over the filter list and create filters based on key in the filter list component
        // then map them to the filters inside of the arrays (This method should be backwards compatible in case
        // we can switch to a future implementation utilizing the mui datatable component directly)
        Object.keys(filters).map((column, index) => {
          const value = filters[column].value;
          const type = filters[column].type;
          if (value !== '' || type === 'isBlank' || type === 'notBlank') {
            const filter = `${filters[column].label} ${filters[column].type} ${filters[column].value}`;
            return (
                <Chip
                    key={index}
                    className={classes.chip}
                    label={filter}
                    onDelete={() => clearFilter(column, props.filters, props.setFilter)}
                />
            );
          }
          return;
        },
        )
      }
    </div>
  );
};

export const CustomFilterList = withStyles(defaultFilterListStyles, { name: 'MUIDataTableFilterList' })(_CustomFilterList);