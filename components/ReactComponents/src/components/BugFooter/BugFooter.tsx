import * as React from 'react';
import './BugFooter.scss';

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
}

/**
 * A footer that contains a link to report any bugs via Google Form
 */
export const BugFooter = (props: IProps) => {
  return (
    <div className={`bugFooter ${props.className ? props.className : ''}`}>
      <p>Maintained by the MARS team. <a href={googleFormURL} target='_blank'><strong>Report a bug.</strong></a></p>
    </div>
  );
};

// HELPERS

const googleFormURL = 'https://www.wrike.com/form/eyJhY2NvdW50SWQiOjIzNj\
E3OTIsInRhc2tGb3JtSWQiOjE4OTcyMX0JNDcwMjkxNTA4NTExMwk0YTVjNmIxMDU2NjA\
4MDZmOTZkMThkYjViOWU1Y2NjM2E5ZGQ0NWE0OGI1OWU0YjkyMmQyYmFkMjIwNjMxZDk2';