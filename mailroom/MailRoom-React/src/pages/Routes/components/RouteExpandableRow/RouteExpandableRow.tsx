import * as React from 'react';
import './RouteExpandableRow.scss';
// tslint:disable-next-line: no-submodule-imports
import { TiFlowChildren } from 'react-icons/ti';
import { TableRow, TableCell } from '@material-ui/core';
import { Link } from 'react-router-dom';

interface IProps {
  /**
   * Current row data
   */
  rowData: any;
  /**
   * Current meta for the row
   */
  rowMeta: any;
  /**
   * The data for all the endpoints
   */
  endpointData: any;
  /**
   * The data for the routes
   */
  routesData: any;
}

export const RouteExpandableRow = (props: IProps) => {

  /**
   * Map the Id from the routes to the desired enpoint when the row is opened
   */
  const mapIdToEndpoints = () => {
    const id = props.rowData[0];
    const routesData = props.routesData;
    const endpointData = props.endpointData;
    const endpoints = [];

    for (let i = 0; i < routesData.length; i++) {
      if (routesData[i].routeId === id) {
        for (let j = 0; j < endpointData.length; j++) {
          if (endpointData[j].id === routesData[i].endpointId) {
            endpoints.push(endpointData[j]);
          }
        }
      }
    }
    return endpoints;
  };

  /**
   * The endpoints that will be constructed into a list
   */
  const endpoints = mapIdToEndpoints();
  return (
    <TableRow>
      { endpoints.length !== 0 &&
      <TableCell colSpan={4}>
        {
          // Map through the endpoints and create the boxes for the routes
          endpoints.map((endpoint: any, index: number) => {
            return (
              <div key={index} className={'routeExpandableRow__routeContainer'}>
                <Link className='routeExpandableRow__routeLink' to={`/endpoints/${endpoint.id}`}>
                  <div 
                   className='routeExpandableRow__routeRow'
                  >
                    <TiFlowChildren className='routeExpandableRow__routeIcon'/>
                    { endpoint.name }
                  </div>
                </Link>
              </div>
            );
          })
        }
      </TableCell>
      }
      {
      // If the endpoints are empty display a short piece of text
      endpoints.length === 0 && 
      <TableCell colSpan={4} className='routeExpandableRow__routeContainer'>
        <p className='routeExpandableRow__routeLink'>No associated endpoints</p>
      </TableCell>
      }
    </TableRow>
  );
};