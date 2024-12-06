import * as React from 'react';
import { SimpleModal, Loading } from '../..';
// tslint:disable-next-line: no-submodule-imports
import { MdClear } from 'react-icons/md';
import './DataModal.scss';

/**
 * Defines expected fields for each tab
 */
interface ITab {
  /**
   * the name of the tab
   */
  title: string;
  /**
   * component to render in the tab
   */
  body: React.ReactNode;
}

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * text to display in modal header
   */
  headerText: string;
  /**
   * whether the modal is currently open
   */
  open: boolean;
  /**
   * function to run when modal is being closed
   */
  onClose: (...args: any[]) => any;
  /**
   * an array of objects that contain tab details (if there is only one tab only the body will be displayed)
   */
  tabs: ITab[];
  /**
   * whether the modal is loading data
   */
  loading: boolean;
  /**
   * which tab to show (index of array)
   */
  activeTab: number;
  /**
   * change active tab
   */
  setActiveTab?: (args0: number) => any;
}

/** 
 * A modal meant for CRUD
 */
export const DataModal = (props: IProps) => {
  return (
    <SimpleModal
      disableBackdropClick
      open={props.open}
      onClose={props.onClose}
      className={`dataModal ${props.className ? props.className : ''}`}
    >
      {/* Header */}
      <div className='dataModal__header'>
        <h2 className='dataModal__headerText'>{props.headerText}</h2>
        <MdClear className='dataModal__exit' onClick={props.onClose}/>
      </div>

      {/* Tabs */}
      <div className='dataModal__tabContainer'>
        {generateTabs(props.tabs, props.activeTab, props.setActiveTab)}
      </div>

      {/* Body */}
      <div className='dataModal__body'>
        {generateBody(props.loading, props.tabs, props.activeTab)}
      </div>

    </SimpleModal>
  );
};

// HELPERS

/**
 * Generate list of tabs list of tab objects(if we have more than one)
 * @param tabs - list of list of tab objects
 * @param active - current active tab index
 */
const generateTabs = (tabs: ITab[], active: number, setActive?: (args0: number) => any) => {
  // Don't generate tabs list of tab objects if we only have one
  if (tabs.length === 1) return;

  // Otherwise, return list of tabs
  return tabs.map((tab: ITab, index: number) => {
    return (
      <span
        key={index}
        onClick={() => setActive ? setActive(index) : console.log('No set active tab function provided.')}
        className={`dataModal__tab ${active === index ? 'active' : ''}`}
      >
        {tab.title}
      </span>
    );
  });
};

/**
 * Generate a body
 * @param loading - whether the modal is still loading data 
 * @param tabs - list of tab objects 
 * @param active - current active index
 */
const generateBody = (loading: boolean, tabs: ITab[], active: number) => {
  if (loading) return <Loading size='med'/>;
  // Return active body
  return tabs[active].body;
};