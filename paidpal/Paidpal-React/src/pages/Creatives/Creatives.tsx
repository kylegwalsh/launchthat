import React from 'react';
import { CreativesTable } from '../../subpages';
import './Creatives.scss';

/**
 * The creatives page
 */
export const Creatives = () => {
  return (
    <div className='full-container'>
      {/* Default creatives route (just show all creatives) */}
      <CreativesTable />
    </div>
  );
};