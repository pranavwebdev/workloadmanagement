import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({
  auth: { isAuthenticated },
  profile: { profile },
  logout
}) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-tachometer-alt" />{' '}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/edit-profile">
          <i className="fas fa-user" /> <span className="hide-sm">Profile</span>
        </Link>
      </li>
      <li>
        <Link to="/workload">
          <i className="fas fa-calendar-alt" />{' '}
          <span className="hide-sm">Workload</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt" />{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/register">
          <i className="fas fa-user-plus" />{' '}
          <span className="hide-sm">Register</span>
        </Link>
      </li>
      <li>
        <Link to="/login">
          <i className="fas fa-sign-in-alt" />{' '}
          <span className="hide-sm">Login</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link
          to="/"
          style={{ fontVariant: 'small-caps', letterSpacing: '0.25rem' }}
        >
          <i className="fas fa-briefcase" /> WorkLoad
        </Link>
      </h1>
      <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  console.log('STATE: ', state.profile.profile);
  return {
    auth: state.auth,
    profile: state.profile
  };
};

export default connect(mapStateToProps, { logout })(Navbar);
