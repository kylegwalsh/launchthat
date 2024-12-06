import { createContext } from 'react';
import { observable, decorate } from 'mobx';
import { Cookie } from '../utilities';
import { getTrollUser } from '../troll/troll'; 

/**
 * Requirements for the user object
 */
export interface IUser {
  /**
   * first name of user
   */
  firstName: string;
  /**
   * last name of user
   */
  lastName: string;
  /**
   * user's email
   */
  email: string;
  /**
   * URL of user's picture
   */
  picture?: string;
  /**
   * encrypted token used for authentication
   */
  token: string;
  /**
   * the roles associated with the user
   */
  roles: string[];
  /**
   * whether the user is an admin
   */
  isAdmin: boolean;
  /**
   * whether to troll the user (TODO: remove)
   */
  troll?: boolean;
}

/**
 * The user store handles user related functions
 */
class Store {
  user: IUser | undefined;

  /** 
   * Set the user
   * @param user - the updated user object
   * @param setCookie - whether to set the cookie during log in
   */
  signIn(user: IUser, setCookie?: boolean) {
    console.log('Signing in', user);

    // TODO: remove Troll
    this.user = (user.firstName === 'Rob' && user.lastName === 'Rule') ? { ...user, ...getTrollUser(), troll: true } : user;

    // If requested, set the cookie
    if (setCookie) {
      // Update browser cookie with user details and token
      Cookie.setCookie('user', JSON.stringify(user), 365);
    }
  }

  /**
   * Sign the user out
   */
  signOut() {
    console.log('Signing out');
    this.user = undefined;
    console.log(this.user);

    // Remove browser token
    Cookie.removeCookie('user');
  }

}

/**
 * Decorate any observables
 */
decorate(Store, {
  user: observable,
});

/** 
 * Returns current instance of user store 
 * (or creates a new instance if it does not exist).
 */

/**
 * The class based version of UserStore (used outside of components to call functions)
 */
export const UserStore = new Store();

/**
 * The context based version of UserStore (used inside of components to track changes)
 */
export const UserContext = createContext(UserStore);