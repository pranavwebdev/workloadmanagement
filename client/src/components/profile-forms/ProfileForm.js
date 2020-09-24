import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import { createProfile, getCurrentProfile } from '../../actions/profile';

const initialState = {
  firstname: '',
  lastname: '',
  dateofbirth: '',
  address: '',
  phone: '',
  city: '',
  employer: '',
  payrate: '',
  contractstartdate: '',
  contractlastdate: ''
};

const ProfileForm = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  history
}) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!profile) getCurrentProfile();
    if (!loading && profile) {
      const profileData = { ...initialState };
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      setFormData(profileData);
    }
  }, [loading, getCurrentProfile, profile]);

  const {
    firstname,
    lastname,
    dateofbirth,
    address,
    phone,
    city,
    employer,
    payrate,
    contractstartdate,
    contractlastdate
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, history, profile ? true : false);
  };

  const editProfile =
    window.location.href.indexOf('edit-profile') > 0 ? true : false;

  const dateFormat = (date = null) =>
    date && (
      <h4>
        <Moment format="DD-MMM-YYYY">
          {moment(date).utcOffset('+0400')._d}
        </Moment>
      </h4>
    );

  return (
    <Fragment>
      <h1 className="large text-primary">Edit Your Profile</h1>
      <p className="lead">
        <i className="fas fa-info-circle" /> Add some changes to your profile
      </p>
      <small>* = required field</small>
      {editProfile && (
        <div>
          <small>
            First Name, Last Name and Date of Birth fields are NON EDITABLE
          </small>
        </div>
      )}
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* First Name"
            name="firstname"
            value={firstname}
            onChange={onChange}
            disabled={editProfile}
          />
          <small className="form-text">
            {!editProfile
              ? 'Please provide your First Name'
              : 'First Name ( NON EDITABLE )'}
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Last Name"
            name="lastname"
            value={lastname}
            onChange={onChange}
            disabled={editProfile}
          />
          <small className="form-text">
            {!editProfile
              ? 'Please provide your Last Name'
              : 'Last Name ( NON EDITABLE )'}
          </small>
        </div>
        <div className="form-group">
          {dateFormat(dateofbirth)}
          {!editProfile && (
            <input
              type="date"
              placeholder="* Date of Birth"
              name="dateofbirth"
              value={dateFormat(dateofbirth)}
              onChange={onChange}
              disabled={editProfile}
            />
          )}
          <small className="form-text">
            {!editProfile
              ? 'Please provide your Date of Birth'
              : 'Date of Birth ( NON EDITABLE )'}
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Address"
            name="address"
            value={address}
            onChange={onChange}
          />
          <small className="form-text">Please provide your Address</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Phone Number"
            name="phone"
            value={phone}
            onChange={onChange}
          />
          <small className="form-text">
            Please provide your Phone Number (eg. 123-456-7890)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* City"
            name="city"
            value={city}
            onChange={onChange}
          />
          <small className="form-text">Please provide your City</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Current Employer"
            name="employer"
            value={employer}
            onChange={onChange}
          />
          <small className="form-text">
            Please provide your Current Employer (eg. ABC Limited)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Pay Rate"
            name="payrate"
            value={payrate}
            onChange={onChange}
          />
          <small className="form-text">
            Please provide your Current Pay Rate (eg. 70)
          </small>
        </div>
        <div className="form-group">
          {dateFormat(contractstartdate)}
          <input
            type="date"
            placeholder="* Contract Start Date"
            name="contractstartdate"
            value={dateFormat(contractstartdate)}
            onChange={onChange}
          />
          <small className="form-text">
            Please provide your Contract Start Date
          </small>
        </div>
        <div className="form-group">
          {dateFormat(contractlastdate)}
          <input
            type="date"
            placeholder="* Contract Last Date"
            name="contractlastdate"
            value={dateFormat(contractlastdate)}
            onChange={onChange}
          />
          <small className="form-text">
            Please provide your Contract Last Date
          </small>
        </div>

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  ProfileForm
);
