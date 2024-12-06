"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides functions relating to dates
 */
exports.Date = {
    /**
     * Format the date nicely (Jan 18, 2019)
     * @param date - date object
     * @return
     * @param {Date} dateStr - the text version of the date
     */
    formatDate: function (date) {
        var monthNames = [
            'Jan', 'Feb', 'Mar',
            'Apr', 'May', 'Jun', 'Jul',
            'Aug', 'Sep', 'Oct',
            'Nov', 'Dec',
        ];
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return monthNames[monthIndex] + " " + day + ", " + year;
    },
};
//# sourceMappingURL=Date.js.map