import * as React from 'react';
const { useState } = React;
import './CustomHeadRender.scss';
import { MdFilterList, MdHelp } from 'react-icons/md';
import { withStyles } from '@material-ui/core/styles';
import { TableCell, TableSortLabel, Tooltip, Zoom, ClickAwayListener } from '@material-ui/core';
import { NumberFilter, WordFilter, RadioFilter } from '../Filters';

/**
 * Styles understood by the MUI provider
 */
const defaultHeadCellStyles = (theme: any) => ({
  root: {
    position: 'relative',
    minWidth: '150px',
    boxShadow: '-1px 0px 0px rgba(224, 224, 224, 1)',
  },
  iconFilterActive: {
    color: 'var(--linkColor) !important',
  },
  tooltip: {
    cursor: 'pointer',
  },
  fixedHeader: {
    position: 'sticky',
    top: '0px',
    left: '0px',
    zIndex: 100,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0px 1px 0px rgba(224, 224, 224, 1), inset -1px 0px 0px rgba(224, 224, 224, 1)',
  },
  sticky: {
    position: 'sticky',
    left: '0px',
    zIndex: 102,
    maxWidth: '450px',
    boxShadow: '0px 1px 0px rgba(224, 224, 224, 1), inset -1px 0px 0px rgba(224, 224, 224, 1)',
    backgroundColor: theme.palette.background.paper,
  },
  data: {
    display: 'inline-block',
  },
  sortAction: {
    display: 'inline-block',
    verticalAlign: 'top',
    cursor: 'pointer',
    paddingLeft: '4px',
    height: '10px',
    position: 'absolute',
  },
  sortActive: {
    color: theme.palette.text.primary,
  },
  toolButton: {
    height: '10px',
    outline: 'none',
    cursor: 'pointer',
  },
  filterAction: {
    display: 'inline-block',
    verticalAlign: 'top',
    cursor: 'pointer',
    height: '10px',
    position: 'absolute',
    right: '0px',
  },
});

/**
 * Special theme for the filter tooltip
 */
const LightTooltip = withStyles((theme: any) => ({
  tooltip: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid rgba(0, 0, 0, 0.25)`,
    boxShadow: theme.shadows[2],
    fontSize: 11,
    padding: 0,
  },
  popper: {
    padding: 0,
    opacity: 1,
  },
}))(Tooltip);

/**
 * Defines expected fields in each value
 */
interface IValues {
  /**
   * a value that determines whether the current box is checked
   */
  checked: boolean;
  /**
   * the value of the current box
   */
  value: string;
  /**
   * label for option
   */
  label: string;
}

interface IProps {
  /**
   * The children nested inside of the default Head Cell
   */
  children?: React.ReactChildren;
  /**
   * Determines whether a filter component should render inside of the table cell,
   * this lets you pick from preset filters which you can send an a
   */
  filter: React.ReactNode | 'Number' | 'Word' | 'Value';
  /**
   * A apply filter function for applying the filter once the filter is selected
   */
  applyFilter?: (
    type: string, value: string, columnName: string, columnLabel: string, filter: any, setFilter: (input: any) => void) => void;
  /**
   * A clear filter function for applying the filter once the filter is selected
   */
  clearFilter?: (columnName: string, filter: any, setFilter: (input: any) => void) => void;
  /**
   * Values to apply when using the preset value filter
   */
  filterValues?: IValues[];
  /** 
   * Extends the style applied to the component
   */
  classes: any;
  /**
   * The column meta data supplied from the custom render function in the column
   */
  columnMeta: any;
  /**
   * A function that handles the toggle of the column
   */
  handleToggleColumn: any;
  /**
   * Function to pass to determine whether this should be a sticky header
   */
  sticky?: boolean;
  /**
   * Determines whether the header should be fixed to the top of the page
   */
  fixedHeader?: boolean;
  /**
   * The filters to apply to the custom filters
   */
  filters?: any;
  /**
   * The filters to apply to the custom filters
   */
  setFilter?: (input: any) => void;
}

// tslint:disable-next-line: variable-name
const _CustomHeadRender = (props: IProps) => {
  const [ filterActive, setFilterActive] = useState(false);

  const { sortDirection, sort, hint, print, index, label, name } = props.columnMeta;

  const sortActive = sortDirection !== null && sortDirection !== undefined ? true : false;

  const sortLabelProps = {
    active: sortActive,
    ...(sortDirection ? { direction: sortDirection } : {}),
  };
  
  const handleFilterClick = () => {
    setFilterActive(!filterActive);
  };

  const handleFilterClose = () => {
    setTimeout(() => setFilterActive(false), 0);
  };

  const handleSortClick = () => {
    props.handleToggleColumn(index);
  };

  const renderFilter = (filter: IProps['filter']) => {
    switch (filter) {
    case 'Word':
      return (props.applyFilter && props.clearFilter && props.filters && props.setFilter)
      ? (
      <WordFilter 
            applyFilter={props.applyFilter} 
            clearFilter={props.clearFilter} 
            closeFilter={handleFilterClose} 
            filters={props.filters}
            setFilter={props.setFilter}
            columnName={name} 
            columnLabel={label}
      />
      ) 
      : <p style={{ color: 'black' }}>Please make sure all your props are set</p>;
    case 'Number':
      return (props.applyFilter && props.clearFilter && props.filters && props.setFilter)
      ? (
      <NumberFilter 
            applyFilter={props.applyFilter} 
            clearFilter={props.clearFilter} 
            closeFilter={handleFilterClose} 
            filters={props.filters}
            setFilter={props.setFilter}
            columnName={name} 
            columnLabel={label}
      />
      ) 
      : <p style={{ color: 'black' }}>Please make sure all your props are set</p>;
    case 'Radio':
      return (props.applyFilter && props.clearFilter && props.filterValues && props.filters && props.setFilter)
      ? 
      (
      <RadioFilter 
            filterValues={props.filterValues} 
            applyFilter={props.applyFilter} 
            clearFilter={props.clearFilter} 
            closeFilter={handleFilterClose}
            filters={props.filters}
            setFilter={props.setFilter}
            columnName={name}
            columnLabel={label}
      />
      )
      : 
      (
      <p style={{ color: 'black' }}>
        Please make sure all you have the props set
      </p>
      );
    case 'Equals':
      return (props.applyFilter && props.clearFilter && props.filters && props.setFilter)
      ? (
      <NumberFilter 
            applyFilter={props.applyFilter} 
            clearFilter={props.clearFilter} 
            closeFilter={handleFilterClose} 
            columnName={name} 
            filters={props.filters}
            setFilter={props.setFilter}
            columnLabel={label}
            equals
      />
      ) 
      : <p style={{ color: 'black' }}>Please make sure all you have the props set</p>;
    default:
      return filter;
    }
  };

  return (
      <TableCell
          className={`${props.classes.cellClass}
          ${props.classes.root}
          ${!print ? 'datatables-noprint' : ''}
          ${props.sticky ? props.classes.sticky : ''}
          ${props.fixedHeader ? props.classes.fixedHeader : ''}`} 
          scope={'col'}
      >
        {sort ? (
            <Tooltip
              title={'Sort'}
              placement={'bottom-end'}
              classes={{
                tooltip: props.classes.tooltip,
              }}
              enterDelay={300}
            >
              <span
                role='button'
                onKeyUp={handleSortClick}
                onClick={handleSortClick}
                className={props.classes.toolButton}
                tabIndex={0}
              >
                <div
                  className={`${props.classes.data} ${ sortActive ? props.classes.sortActive : ''}`}>
                  {props.children ? props.children : label}
                </div>
                <div className={props.classes.sortAction}>
                  <TableSortLabel {...sortLabelProps} />
                </div>
              </span>
            </Tooltip>
          ) : (
              props.children ? props.children : label
          )}
          {hint && (
            <Tooltip
              title={hint}
              placement={'bottom-end'}
              classes={{
                tooltip: props.classes.tooltip,
              }}
              enterDelay={300}
            >
              <MdHelp fontSize='small'/>
            </Tooltip>
          )}
        {
          props.filter && (
          <LightTooltip
            className={props.classes.filter}
            interactive
            TransitionComponent={Zoom}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            onClose={handleFilterClose}
            open={filterActive}
            title={
              <React.Fragment>
                <ClickAwayListener onClickAway={handleFilterClose}>
                  {
                    props.filter &&
                    renderFilter(props.filter)
                  }
              </ClickAwayListener>
            </React.Fragment>
            }
          >
            <span
                role='button'
                onClick={handleFilterClick}
                className={props.classes.toolButton}
                tabIndex={0}
            >
              <div className={`${props.classes.filterAction}`}>
                <TableSortLabel classes={filterActive ? { icon: props.classes.iconFilterActive } : {}} IconComponent={MdFilterList} active/>
              </div>
            </span> 
          </LightTooltip>
          )
        }
      </TableCell>
  );
};

export const CustomHeadRender = withStyles(defaultHeadCellStyles, { name: 'MUIDataTableHeadCell' })(_CustomHeadRender);