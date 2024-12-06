import * as React from 'react';
import './LoadingOverlay.scss';
import { Loading } from '../../../../';

export const LoadingOverlay = () => {
  return (
    <div className='loadingOverlay'>
      <Loading size='med'/>
    </div>
  );
};