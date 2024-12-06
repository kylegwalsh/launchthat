import * as moment from 'moment-timezone';

/**
 * Contains methods related to formatting
 */
const Format = {

  // Format date as "Oct 31, 2018"
  formatDate: (date) => {
    return moment(date).tz('America/New_York').format('MMM D, YYYY');
  },
  
  // Format time as "12:30 PM"
  formatTime: (date) => {
    return moment(date).tz('America/New_York').format('h:mm A');
  },
  
  // Reformats keys to look nice (Title Case with spaces instead of underscores)
  titleCase: (key) => {
    if (!key) return '';
    
    const frags = key.split(/_| /);
    for (let i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  },

  // Extracts nested fields into a flat object (handles one level deep)
  flattenObject: (fields) => {
    const flatFields = {};

    // Loop through the categories in the fields and extract nested fields
    for (const category in fields) {
      // Loop through the fields in each category and extract them
      for (const field in fields[category]) {
        flatFields[field] = fields[category][field];
      }
    }

    return flatFields;
  },

  // Checks whether the object is empty and returns a boolean
  isEmpty: (obj) => {
    // Loop through keys (if they exist)
    for (const key in obj) {
      if (obj[key] || obj[key] === 0) return false;
    }

    return true;
  },

  // Generates long id from lead id
  generateLongLeadID: (leadId) => {
    if (leadId) {
      let long = leadId.toString();

      // Prepend 0s
      while (long.length < 16) {
        long = '0' + long;
      }

      // Prepend PT
      long = 'PT' + long;

      return long;
    }
    
    return leadId;
  },

};

export { Format };