import * as React from 'react';

export const DataTable = () => {
  return (
    <div/>
  );
};

// import clsx from 'clsx';
// import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
// import TableRow from '@material-ui/core/TableRow';
// import TableSortLabel from '@material-ui/core/TableSortLabel';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import Paper from '@material-ui/core/Paper';
// import Checkbox from '@material-ui/core/Checkbox';
// import IconButton from '@material-ui/core/IconButton';
// import Tooltip from '@material-ui/core/Tooltip';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Switch from '@material-ui/core/Switch';
// import DeleteIcon from '@material-ui/icons/Delete';
// import FilterListIcon from '@material-ui/icons/FilterList';
// import { lighten } from '@material-ui/core/styles/colorManipulator';

/** 
 * Defines expected props for this component
 */
// interface IProps {
//   /**
//    * className applied to component
//    */
//   className?: string;
//   /**
//    * title to show on the table
//    */
//   title?: string;
//   /**
//    * list of column details to give the table
//    */
//   columns: any[];
//   /**
//    * the data being displayed in the table (requires same number of fields as headers prop)
//    */
//   data?: any[];
//   /**
//    * a list of options used to describe the table
//    */
//   options: {
//     /**
//      * Determines the behavior of the talble when it needs to become responsive
//      */
//     responsive?: string;
//     /**
//      * function to render a custom toolbar
//      */
//     customToolbar?: () => React.ReactNode;
//     /**
//      * whether to use server side rendering on the table
//      */
//     serverSide?: boolean;
//     /**
//      * determines if the rows can be selected
//      */
//     selectableRows?: boolean;
//     /**
//      * A function that runs when a row is selected
//      */
//     onRowsSelect?: (currentRowsSelected: any[], allRowsSelected: any[]) => void;
//     /**
//      * callback function that's called when a row is clicked
//      */
//     onRowClick?: (rowData: string[], rowMeta: {
//       dataIndex: number, rowIndex: number,
//     }) => any;
//     /**
//      * callback function that's called when a cell is clicked
//      */
//     onCellClick?: (colData: any, cellMeta: { colIndex: number, rowIndex: number, dataIndex: number }) => void;
//     /**
//      * renders a custom toolbar when items on the table are selected
//      */
//     customToolbarSelect?: (selectableRows: any, displayData: any, setSelectedRows: any) => void;
//     /**
//      * makes boolean that makes the rows have an expandable bottom
//      */
//     expandableRows?: boolean;
//     /**
//      * renders the exapandable row component
//      */
//     renderExpandableRow?: (rowData: string[], rowMeta: any) => React.ReactNode;
//     /**
//      * determines if a certain row can be selected
//      */
//     isRowSelectable?: (dataIndex: number) => boolean;
//     /**
//      * function to run when row is deleted natively
//      */
//     onRowDelete?: (rowsDeleted: string[]) => void;
//     /**
//      * function to run when page changes (server side)
//      */
//     onChangePage?: (currentPage: number) => void;
//     /**
//      * function to run when filter changes (server side)
//      */
//     onFilterChange?: (changedColumn: string, filterList: string[]) => void;
//     /**
//      * function to run when column is sorted (server side)
//      */
//     onColumnSortChange?: (changedColumn: string, direction: string) => void;
//     /**
//      * whether to enable the download (csv export) feature
//      */
//     download?: boolean;
//     /**
//      * Pass in a custom row to render in the table
//      */
//     customRowRender?: (data: any, dataIndex: number, rowIndex: number) => React.ReactNode;
//     /**
//      * The amount of rows per page that the user can pick from
//      */
//     rowsPerPageOptions?: number[]
//   };
// }

// function createData(name: any, calories: any, fat: any, carbs: any, protein: any) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Donut', 452, 25.0, 51, 4.9),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
//   createData('Honeycomb', 408, 3.2, 87, 6.5),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Jelly Bean', 375, 0.0, 94, 0.0),
//   createData('KitKat', 518, 26.0, 65, 7.0),
//   createData('Lollipop', 392, 0.2, 98, 0.0),
//   createData('Marshmallow', 318, 0, 81, 2.0),
//   createData('Nougat', 360, 19.0, 9, 37.0),
//   createData('Oreo', 437, 18.0, 63, 4.0),
// ];

// function desc(a: any, b: any, orderBy: any) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function stableSort(array: any, cmp: any) {
//   const stabilizedThis = array.map((el: any, index: number) => [el, index]);
//   stabilizedThis.sort((a: any, b: any) => {
//     const order = cmp(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el: any) => el[0]);
// }

// function getSorting(order: any, orderBy: any) {
//   return order === 'desc' ? (a: any, b: any) => desc(a, b, orderBy) : (a: any, b: any) => -desc(a, b, orderBy);
// }

// const headRows = [
//   { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
//   { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
//   { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
//   { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
//   { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
// ];

// function EnhancedTableHead(props: any) {
//   const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
//   const createSortHandler = (property: any) => (event: any) => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow>
//         <TableCell padding='checkbox'>
//           <Checkbox
//             indeterminate={numSelected > 0 && numSelected < rowCount}
//             checked={numSelected === rowCount}
//             onChange={onSelectAllClick}
//           />
//         </TableCell>
//         {headRows.map((row) => (
//           <TableCell
//             key={row.id}
//             align={row.numeric ? 'right' : 'left'}
//             padding={row.disablePadding ? 'none' : 'default'}
//             sortDirection={orderBy === row.id ? order : false}
//           >
//             <TableSortLabel
//               active={orderBy === row.id}
//               direction={order}
//               onClick={createSortHandler(row.id)}
//             >
//               {row.label}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// }

// EnhancedTableHead.propTypes = {
//   numSelected: PropTypes.number.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.string.isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };

// const useToolbarStyles = makeStyles((theme: any) => ({
//   root: {
//     paddingLeft: theme.spacing(2),
//     paddingRight: theme.spacing(1),
//   },
//   highlight:
//     theme.palette.type === 'light'
//       ? {
//         color: theme.palette.secondary.main,
//         backgroundColor: lighten(theme.palette.secondary.light, 0.85),
//       }
//       : {
//         color: theme.palette.text.primary,
//         backgroundColor: theme.palette.secondary.dark,
//       },
//   spacer: {
//     flex: '1 1 100%',
//   },
//   actions: {
//     color: theme.palette.text.secondary,
//   },
//   title: {
//     flex: '0 0 auto',
//   },
// }));

// const EnhancedTableToolbar = (props: any) => {
//   const classes = useToolbarStyles();
//   const { numSelected } = props;

//   return (
//     <Toolbar
//       className={clsx(classes.root, {
//         [classes.highlight]: numSelected > 0,
//       })}
//     >
//       <div className={classes.title}>
//         {numSelected > 0 ? (
//           <Typography color='inherit' variant='subtitle1'>
//             {numSelected} selected
//           </Typography>
//         ) : (
//           <Typography variant='h6' id='tableTitle'>
//             Nutrition
//           </Typography>
//         )}
//       </div>
//       <div className={classes.spacer} />
//       <div className={classes.actions}>
//         {numSelected > 0 ? (
//           <Tooltip title='Delete'>
//             <IconButton aria-label='Delete'>
//               <DeleteIcon />
//             </IconButton>
//           </Tooltip>
//         ) : (
//           <Tooltip title='Filter list'>
//             <IconButton aria-label='Filter list'>
//               <FilterListIcon />
//             </IconButton>
//           </Tooltip>
//         )}
//       </div>
//     </Toolbar>
//   );
// };

// EnhancedTableToolbar.propTypes = {
//   numSelected: PropTypes.number.isRequired,
// };

// const useStyles = makeStyles((theme: any) => ({
//   root: {
//     width: '100%',
//     marginTop: theme.spacing(3),
//   },
//   paper: {
//     width: '100%',
//     marginBottom: theme.spacing(2),
//   },
//   table: {
//     minWidth: 750,
//   },
//   tableWrapper: {
//     overflowX: 'auto',
//   },
// }));

// function EnhancedTable() {
//   const classes = useStyles();
//   const [order, setOrder] = React.useState('asc');
//   const [orderBy, setOrderBy] = React.useState('calories');
//   const [selected, setSelected] = React.useState([]);
//   const [page, setPage] = React.useState(0);
//   const [dense, setDense] = React.useState(false);
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);

//   function handleRequestSort(event: any, property: any) {
//     const isDesc = orderBy === property && order === 'desc';
//     setOrder(isDesc ? 'asc' : 'desc');
//     setOrderBy(property);
//   }

//   function handleSelectAllClick(event: any) {
//     if (event.target.checked) {
//       const newSelecteds: any = rows.map((n) => n.name);
//       setSelected(newSelecteds);
//       return;
//     }
//     setSelected([]);
//   }

//   function handleClick(event: any, name: never) {
//     const selectedIndex = selected.indexOf(name);
//     let newSelected: any = [];
//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, name);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1),
//       );
//     }

//     setSelected(newSelected);
//   }

//   function handleChangePage(event: any, newPage: any) {
//     setPage(newPage);
//   }

//   function handleChangeRowsPerPage(event: any) {
//     setRowsPerPage(+event.target.value);
//   }

//   function handleChangeDense(event: any) {
//     setDense(event.target.checked);
//   }

//   const isSelected = (name: never) => selected.indexOf(name) !== -1;

//   const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

//   return (
//     <div className={classes.root}>
//       <Paper className={classes.paper}>
//         <EnhancedTableToolbar numSelected={selected.length} />
//         <div className={classes.tableWrapper}>
//           <Table
//             className={classes.table}
//             aria-labelledby='tableTitle'
//             size={dense ? 'small' : 'medium'}
//           >
//             <EnhancedTableHead
//               numSelected={selected.length}
//               order={order}
//               orderBy={orderBy}
//               onSelectAllClick={handleSelectAllClick}
//               onRequestSort={handleRequestSort}
//               rowCount={rows.length}
//             />
//             <TableBody>
//               {stableSort(rows, getSorting(order, orderBy))
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((row: any) => {
//                   const isItemSelected = isSelected(row.name);
//                   return (
//                     <TableRow
//                       hover
//                       onClick={(event) => handleClick(event, row.name)}
//                       role='checkbox'
//                       aria-checked={isItemSelected}
//                       tabIndex={-1}
//                       key={row.name}
//                       selected={isItemSelected}
//                     >
//                       <TableCell padding='checkbox'>
//                         <Checkbox checked={isItemSelected} />
//                       </TableCell>
//                       <TableCell component='th' scope='row' padding='none'>
//                         {row.name}
//                       </TableCell>
//                       <TableCell align='right'>{row.calories}</TableCell>
//                       <TableCell align='right'>{row.fat}</TableCell>
//                       <TableCell align='right'>{row.carbs}</TableCell>
//                       <TableCell align='right'>{row.protein}</TableCell>
//                     </TableRow>
//                   );
//                 })}
//               {emptyRows > 0 && (
//                 <TableRow style={{ height: 49 * emptyRows }}>
//                   <TableCell colSpan={6} />
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component='div'
//           count={rows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           backIconButtonProps={{
//             'aria-label': 'Previous Page',
//           }}
//           nextIconButtonProps={{
//             'aria-label': 'Next Page',
//           }}
//           onChangePage={handleChangePage}
//           onChangeRowsPerPage={handleChangeRowsPerPage}
//         />
//       </Paper>
//       <FormControlLabel
//         control={<Switch checked={dense} onChange={handleChangeDense} />}
//         label='Dense padding'
//       />
//     </div>
//   );
// }

// export default EnhancedTable;