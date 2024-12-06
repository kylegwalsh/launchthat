import { createContext } from 'react';
import { NotificationManager } from 'react-notifications';
// TODO: remove troll
import { successNoise, errorNoise } from '../troll/troll';

/**
 * The notification store handles all user notifications
 */
class Store {
  /** 
   * Add a notification
   * @param type - type of notification (info, success, danger, warn)
   * @param message - long content for body of notification
   * @param title - short title of notification
   * @param timeOut - length of time (in ms) to show notification (timeOut of 0 is indefinite)
   * @param cb - callback function to run if notification is clicked
   */
  addNotification(
    type: 'info' | 'success' | 'error' | 'warning',
    message?: string | undefined,
    title?: string | undefined,
    timeOut?: number | undefined,
    onClick?: (...args: any[]) => any | undefined,
  ) {
    console.log('New notification');
    const id = (new Date()).getTime();

    NotificationManager.create({
      id,
      type,
      message,
      title,
      timeOut: timeOut ? timeOut : 0,
      onClick: onClick ? () => { onClick(); this.removeNotification(id); } : this.removeNotification(id),
    });

    // TODO: remove troll
    if (type === 'success') successNoise();
    if (type === 'error') errorNoise();
  }

  /** 
   * Remove a notification
   */
  removeNotification(id: number) {
    NotificationManager.remove({ id });
  }
}

/** 
 * Returns current instance of notification store 
 * (or creates a new instance if it does not exist)
 */

/**
 * The class based version of NotificationStore (used outside of components to call functions)
 */
export const NotificationStore = new Store();

/**
 * The context based version of NotificationStore (used inside of components to track changes)
 */
export const NotificationContext = createContext(NotificationStore);