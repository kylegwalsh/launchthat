/**
 * Provides functions relating to formatting
 */
export const Format = {
  /**
   * Format the date nicely (Jan 18, 2019)
   * @param date - date object
   * @return
   * @param {string} dateStr - the text version of the date
   */
  date: (date: Date) => {
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

  /**
   * Format the date/time nicely (Jane 18, 2019 10:00PM)
   * @param date - date object
   * @return
   * @param {string} dateTimeStr - the text version of the date time
   */
  dateTime: (date: Date) => {
    const monthNames = [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct',
      'Nov', 'Dec',
    ];
  
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minuteNum = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes = minuteNum < 10 ? '0' + minuteNum : minuteNum;

    return `${monthNames[monthIndex]} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
  },

  /**
   * Title case provided string
   * @param string - string to change to title case
   * @returns
   * @param {string} title - title-cased string
   */
  titleCase: (text: string) => {
    return text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },
};