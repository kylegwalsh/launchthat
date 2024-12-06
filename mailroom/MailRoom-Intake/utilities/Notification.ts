import { getConfig } from './../config';
import { Format } from '.'; 

/**
 * A utility used for notifications
 */
export const Notification = {

  /**
   * Generates a slack message
   * @param channel - the channel to send the message to
   * @param color - what color to use for the slack message left border (can be good, warning, danger, or a hex value)
   * @param message - text message to show in the attachment (can be used with our without fields)
   * @param title - the title to use for the slack message (optional)
   */
  generateSlack: async(channel: string, color: string, message: string, title?: string, leadId?: string) => {
    // Get the current date
    const now = new Date();

    // Create JS date object for other functions
    const formattedDate = Format.formatDate(now);
    const formattedTime = Format.formatTime(now);

    // Get the app's config
    const config = await getConfig();

    // *** Customize this formatting to meet your needs *** 
    // Create email JSON object
    const slack = {
      username: config.app.name,
      icon_emoji: config.slack.emoji,
      channel: `#${channel}`,
      attachments: [{
        fallback: message,
        title,
        color,
        text: message,
        fields: [
          {
            title: 'Date',
            value: formattedDate,
            short: true
          },
          {
            title: 'Time',
            value: formattedTime,
            short: true
          }
        ]
      }]
    };

    // If lead id is provided, display it in the message
    if (leadId) {
      // Insert entry
      slack.attachments[0].fields.push({
        title: 'Lead ID',
        // Using long PT luid string for now
        value: Format.generateLongLeadID(leadId),
        short: true
      });
    }

    return slack;
  },
};