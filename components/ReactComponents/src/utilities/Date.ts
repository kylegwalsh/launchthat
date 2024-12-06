/**
 * Provides functions relating to dates
 */
export const Date = {
  /**
   * Format the date nicely (Jan 18, 2019)
   * @param date - date object
   * @return
   * @param {Date} dateStr - the text version of the date
   */
  formatDate: (date: Date) => {
    const monthNames = [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct',
      'Nov', 'Dec',
    ];
  
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
  
    return `${monthNames[monthIndex]} ${day}, ${year}`;
  },
};