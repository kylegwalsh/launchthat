import moment from 'moment-timezone';

// Contains methods relating to formatting
const Format = {
  // Format date as "Oct 31, 2018"
  formatDate: (date) => {
    return moment(date)
      .tz('America/New_York')
      .format('MMM D, YYYY');
  },

  // Format time as "12:30 PM"
  formatTime: (date) => {
    return moment(date)
      .tz('America/New_York')
      .format('h:mm A');
  },

  // Reformats keys to look nice (Title Case with spaces instead of underscores)
  formatField: (key) => {
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

  // Format duration as minutes and seconds
  formatDuration: (duration) => {
    return `${Math.floor(duration / 60)} Minutes, ${duration % 60} Seconds`;
  },

  // Maps fields using a field map and returns the results
  mapFields: (fields, field_map, strip_blanks, email) => {
    // Create object to store new custom mappings
    const replacedItems = {};

    // Format using email field map
    if (email) {
      field_map.forEach((categoryArr) => {
        // Loop through the categories in our field map
        for (const category in categoryArr) {
          // Create the category in our new object
          replacedItems[category] = {};

          // Loop through field mappings within each category and assign them to the new object
          categoryArr[category].forEach((map) => {
            // Make sure not to insert a field if it's blank and we're stripping blanks
            if (!(strip_blanks && !(fields[map.target] || fields[map.target] === 0))) replacedItems[category][map.output] = fields[map.target];
          });

          // Remove the category if it's empty
          if (strip_blanks && Format.isEmpty(replacedItems[category])) delete replacedItems[category];
        }
      });
    }
    // Format using http field map
    else {
      // Loop through field mappings within each category and assign them to the new object
      field_map.forEach((map) => {
        // Make sure not to insert a field if it's blank and we're stripping blanks
        if (!(strip_blanks && !(fields[map.target] || fields[map.target] === 0))) replacedItems[map.output] = fields[map.target];
      });
    }

    return replacedItems;
  },

  // Remove blanks from fields (only used when no field map exists)
  stripBlanks: (fields) => {
    // Create object to store stripped fields
    const replacedItems = {};

    // Remove blanks
    for (const field in fields) {
      if (fields[field]) replacedItems[field] = fields[field];
    }

    return replacedItems;
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
  generateLongLeadID: (lead_id) => {
    if (lead_id) {
      let long = lead_id.toString();

      // Prepend 0s
      while (long.length < 16) {
        long = '0' + long;
      }

      // Prepend PT
      long = 'PT' + long;

      return long;
    }

    return lead_id;
  },
};

export { Format };
