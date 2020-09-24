import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';
import { connect } from 'react-redux';
import { getWorkloads } from '../../actions/workload';

const Workload = ({ getWorkloads, workloads: { workloads } }) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  useEffect(() => {
    getWorkloads();
  }, [getWorkloads]);
  const workloadlog = workloads.map((wl) => {
    let dateStatus =
      moment(wl.weeklastdate).utcOffset('+0400')._d <= moment(currentDate)._d;

    if (dateStatus) {
      return (
        <tr key={wl._id}>
          <td className="hide-sm">{wl.weekname}</td>
          <td>
            <Moment format="Do MMMM YYYY">
              {moment.utc(wl.weekstartdate)}
            </Moment>
          </td>
          <td>
            <Moment format="Do MMMM YYYY">{moment.utc(wl.weeklastdate)}</Moment>
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={wl._id} className="inactive">
          <td className="hide-sm">{wl.weekname} ( INACTIVE )</td>
          <td>
            <Moment format="Do MMMM YYYY">
              {moment.utc(wl.weekstartdate)}
            </Moment>
          </td>
          <td>
            <Moment format="Do MMMM YYYY">{moment.utc(wl.weeklastdate)}</Moment>
          </td>
        </tr>
      );
    }
  });

  return (
    <Fragment>
      <h1 className="large text-primary">Workload Log</h1>
      <p className="lead">
        <i className="fas fa-calendar-alt" /> Check your workload logs, upto
        current week
      </p>
      <table className="table">
        <thead>
          <tr>
            <th className="hide-sm">Week Number</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>{workloadlog}</tbody>
      </table>
      <Link className="btn btn-light my-1" to="/dashboard">
        Go Back
      </Link>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  workloads: state.workload
});

Workload.propTypes = {
  getWorkloads: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getWorkloads })(Workload);
