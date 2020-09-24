import api from '../utils/api';

import { GET_WORKLOAD, WORKLOAD_ERROR } from './types';

// Get current user's workloads
export const getWorkloads = () => async (dispatch) => {
  try {
    const res = await api.get('/workloads');

    dispatch({
      type: GET_WORKLOAD,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: WORKLOAD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
