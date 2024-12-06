import { useState, useEffect } from 'react';
import { useAPI } from '.';

/**
 * Hook that manages server side rendering for tables
 */
export const useServerSidePagination = (route: string, columnNames: string[], defaultSort?: { column: string, direction: string }) => {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = defaultSort ? 
    useState<{ column: string, direction: string }>(defaultSort) : 
    useState<{ column: string, direction: string }>({ column: '', direction: '' });
  const [filter, setFilter] = useState<any[][]>([]);
  const [stringFilter, setStringFilter] = useState('');
  const [loading, ldData, setLdData, errors, setErrors, queryAPI, refreshLdData] = 
    useAPI(route, {
      queryParams: `itemsPerPage=${rowsPerPage}&page=${page}${defaultSort ? `&order[${defaultSort.column}]=${defaultSort.direction}` : ''}`,
      contentType: 'application/ld+json',
    });
  const [data, setData] = useState<any>(undefined);

  /**
   * Generate filter options if we haven't already
   */
  useEffect(() => {
    // Check to see if the filter array is empty and populate it with empty arrays that match the
    // length of the column names array
    if (filter.length === 0) {
      for (let i = 0; i < columnNames.length + 1; i++) filter.push([]);
    }
    // Track the loading and ldData object returned from the api and parse the data
    if (!loading && ldData) {
      parseData();
    }
  }, [loading, ldData]);

  /**
   * Parses the ld+json into a format that is readable from the table
   */
  const parseData = () => {
    if (ldData['hydra:totalItems']) {
      setData(ldData['hydra:member']);
      setCount(ldData['hydra:totalItems']);
    } else {
      // Only run if the data object returned doesn't have an array of data objects
      const tempData = []; 
      tempData.push(ldData); 
      setData(tempData);
      const tempCount = tempData.length;
      setCount(tempCount);
    }
  };

  /**
   * Refresh the data for the server-side pagination
   */
  const refreshData = async() => {
    const newData = await queryAPI('GET', {
      queryParams: `${sort.column ? `order[${sort.column}]=${sort.direction}&` : ''}` + 
      `itemsPerPage=${rowsPerPage}&page=${page}${stringFilter}`,
      contentType: `application/ld+json`,
    });
    setLdData(newData);
  };

  /**
   * Sends new page to server side API
   * @param page - specifies the desired page on the table that the server-side function should render
   */
  const changePage = async(page: number) => {
    // Add a value to the page because the API starts from 1
    page += 1;

    const newData = await queryAPI('GET', {
      queryParams: `${sort.column ? `order[${sort.column}]=${sort.direction}&` : ''}` +
      `itemsPerPage=${rowsPerPage}&page=${page}${stringFilter}`,
      contentType: `application/ld+json`,
    });
    setLdData(newData);
    setPage(page);
  };

  /**
   * Change the amount of rows per server-side render
   * @param rowsPerPage - specifies the desired rows per page
   */
  const changeRowsPerPage = async(rowsPerPage: number) => {
    const newData = await queryAPI('GET', {
      queryParams: `${sort.column ? `order[${sort.column}]=${sort.direction}&` : ''}` +
      `itemsPerPage=${rowsPerPage}&page=${page}${stringFilter}`,
      contentType: `application/ld+json`,
    });
    console.log(rowsPerPage);
    setLdData(newData);
    setRowsPerPage(rowsPerPage);
  };

  /**
   * Changes the filter of the table
   * @param filterArray - The filters that you wish to apply to the server-side query
   */
  const changeFilter = async(filterArray: any) => {
    let filterString = '';
    setFilter(filterArray);
    const tempPage = 1;
    setPage(tempPage);
    for (let i = 0; i < filterArray.length; i++) {
      if (filterArray[i].length !== 0) {
        filterString += filterArray[i] ? (`&${columnNames[i]}=${filterArray[i]}`) : '';
      }
    }
    const newData = await queryAPI('GET', {
      queryParams: `${sort.column ? `order[${sort.column}]=${sort.direction}&` : ''}` +
      `itemsPerPage=${rowsPerPage}&page=${tempPage}${filterString}`,
      contentType: `application/ld+json`,
    });
    setLdData(newData);
    setStringFilter(filterString);
  };

  /**
   * Changes the sorting applied to table
   * @param column - which column is sorted
   * @param direction - order of sort
   */
  const changeSort = async(column: string, direction: string) => {
    console.log('Sort', column, direction);
    const newData = await queryAPI('GET', {
      queryParams: `${column ? `order[${column}]=${direction}&` : ''}itemsPerPage=${rowsPerPage}&page=${page}${stringFilter}`,
      contentType: `application/ld+json`,
    });
    setLdData(newData);
    setSort({ column, direction });
  };

  /**
   * Only supports search for id column(TODO: Implement searches for different column types)
   * @param searchText - The string that is passed onto the search function to be searched
   */
  const search = async(searchText: string) => {
    if (searchText) {
      const searchFilter = filter;
      // tslint:disable-next-line: radix
      searchFilter[0][0] = parseInt(searchText);
      setFilter(searchFilter);
      
      const newData = await queryAPI('GET', {
        queryParams: `${sort.column ? `order[${sort.column}]=${sort.direction}&` : ''}` + 
        `itemsPerPage=${rowsPerPage}&page=${page}${stringFilter}&id=${searchText}`,
        contentType: `application/ld+json`,
      });
      setLdData(newData);
    }
  };
  
  return [page, count, rowsPerPage, changePage, filter, changeFilter, changeRowsPerPage, 
    sort, changeSort, loading, data, setData, errors, setErrors, queryAPI, refreshData, search];
};