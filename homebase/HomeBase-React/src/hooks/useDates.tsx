import { useState } from 'react';
import * as moment from 'moment';

/**
 * Custom hook to manage date picker state
 * @param initialStartDate - The start date for for the date state
 * @param initialEndDate - The end date for the date state
 */
export const useDates = (initialStartDate: moment.Moment | null, initialEndDate: moment.Moment | null) => {
  const [startDate, setStartDate] = useState<any>(initialStartDate);
  const [endDate, setEndDate ] = useState<any>(initialEndDate);

  /**
   * 
   * @param startDate - Takes the updated start date value
   * @param endDate - Takes the updated end date value
   */
  const setDate = (startDate: (moment.Moment | null), endDate: (moment.Moment | null)) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return [startDate, endDate, setDate];
};