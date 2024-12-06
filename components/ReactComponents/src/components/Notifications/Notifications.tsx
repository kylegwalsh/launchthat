import * as React from 'react';
import { NotificationContainer } from 'react-notifications';
// tslint:disable-next-line: no-submodule-imports
import 'react-notifications/lib/notifications.css';
import './Notifications.scss';

/** 
 * The list containing all app notifications
 */
export const Notifications = () => {
  return (
    <NotificationContainer/>
  );
};