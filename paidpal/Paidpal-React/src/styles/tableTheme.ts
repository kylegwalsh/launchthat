// tslint:disable-next-line: no-submodule-imports
import { createMuiTheme } from '@material-ui/core/styles';

export const PaidpalTheme = () => createMuiTheme({
  overrides: {
    MUIDataTableSelectCell: {
      fixedHeader: {
        backgroundColor: 'white',
        zIndex: '101 !important',
      },
    },
    MuiToolbar: {
      root: {
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
      },
    },
    MUIDataTableHeadCell: {
      root: {
        fontSize: 15,
      },
    },
    // MUIDataTable: {
    //   responsiveScroll: {
    //     // overflowX: 'none',
    //     // height: 'auto',
    //     // maxHeight: 'auto',
    //   },
    // },
    MuiCheckbox: {
      root: {
        padding: 0,
        // fontSize: '1rem !important',
      },
    },
    MuiTableRow: {
      root: {
        height: 'auto',
      },
    },
    MUIDataTableBodyCell: {
      root: {
        minWidth: 120,
        paddingTop: 0,
        paddingBottom: 0,
        // border: '1px solid black', 
      },
    },
    MuiTableCell: {
      root: {
        padding: 0,
        paddingRight: 4,
        paddingLeft: 4,
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
        borderRight: '1px solid rgba(224, 224, 224, 1)',
      },
    },
  },
});