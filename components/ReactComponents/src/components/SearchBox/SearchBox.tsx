import * as React from 'react';
// tslint:disable-next-line: no-submodule-imports
import { MdSearch } from 'react-icons/md';
import './SearchBox.scss';

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * object containing classNames
   */
  className?: {
    /**
     * className applied to input
     */
    input?: string,
    /**
     * className applied to container
     */
    container?: string,
    /**
     * className applied to button
     */
    button?: string,
  };
  /**
   * input placeholder
   */
  placeholder?: string;
  /**
   * function handling update of input value when value changes
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * function handling submission of search
   */
  onSubmit: (event: React.MouseEvent<HTMLElement>) => void;
  /**
   * value of input (updated in onChange)
   */
  value: string;
}

/** 
 * A generic search box
 */
export const SearchBox = (props: IProps) => {
  return (
    <form className={`searchBox ${(props.className && props.className.container) ? props.className.container : ''}`}>
      <div className='searchBox__group'>
        <input
          className={`searchBox__input ${(props.className && props.className.input) ? props.className.input : ''}`}
          type='search'
          placeholder={props.placeholder}
          onChange={props.onChange}
          value={props.value}
        />
        <button
          type='submit'
          onClick={(e) => submitSearch(e, props.onSubmit)}
          className={`searchBox__button ${(props.className && props.className.button) ? props.className.button : ''}`}
        >
          <MdSearch className='searchBox__icon'/>
        </button>
      </div>
    </form>
  );
};

/** 
 * Intermediary submission that prevents page from reloading
 */
const submitSearch = (e: React.MouseEvent<HTMLElement>, submit: (e?: any) => void) => {
  // Prevent page refresh
  e.preventDefault();
  
  // Submit search
  submit();

  // Blur input
  if ('activeElement' in document && document.activeElement) (document.activeElement as HTMLElement).blur();
};