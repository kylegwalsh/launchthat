import moment from 'moment';

/**
 * Provides functions relating to table filters
 */
export const Filter = {
  // Default filter date values
  defaultStartDate: moment.utc().subtract(31, 'days'),
  defaultEndDate: moment.utc().subtract(1, 'days'),

  /**
   * Formats the filters in a way that the backend can digest
   * @param filters - name of the cookie
   * @param startDate - the start date for the filter range
   * @param endDate - the end date for the filter range
   * @return {object} formattedFilters - the correctly formatted filters
   */
  formatFields: (fields: { [key: string]: any }) => {
    console.log('Formatting field filters', fields);

    // Correctly formatted field filters
    const formattedFields: { key: string, type: string, value: any }[] = [];
    
    // Remove any filters that contain a blank value
    for (const key in fields) {
      if (fields[key].type) {

        // Need to handle the "between" type specially
        if (fields[key].type === 'between') {
          const splitValues = fields[key].value.split(',');

          formattedFields.push({
            key,
            type: 'between',
            value: {
              start: splitValues[0],
              end: splitValues[1],
            },
          });
        }
        // Everything else can be pushed normally
        else {
          formattedFields.push({
            key,
            type: fields[key].type,
            value: fields[key].value,
          });
        }
      }
    }

    console.log('FORMATTED FIELDS', formattedFields);

    // Return our formatted filters object (or undefined if we didn't apply any filters)
    return formattedFields;
  },

  /**
   * Apply a filter on the table
   * @param type - The type of the filter being used (equals, less than, etc.)
   * @param value - The value passed back to compare to
   * @param columnName - The name of the column the filter should be applied to
   * @param columnLabel - The column label for (For aesthetic purposes)
   */
  applyFilter: (type: string, value: string, columnName: string, columnLabel: string, filters: any, setFilter: (input: any) => void) => {
    const newFilters: any = { ...filters };
    newFilters[columnName] = {
      type,
      value,
      label: columnLabel,
    };
    setFilter(newFilters);
  },

  /**
   * Clear the filter on a column
   * @param columnName - the name of the column to clear the filter for
   */
  clearFilter: (columnName: string, filters: any, setFilter: (input: any) => void) => {
    const newFilters: any = { ...filters };
    newFilters[columnName] = {
      type: '',
      value: '',
      label: '',
    };
    setFilter(newFilters);
  },
};