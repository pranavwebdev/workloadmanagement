import { GET_WORKLOAD, WORKLOAD_ERROR } from '../actions/types';

const initialState = {
  workloads: [],
  loading: true,
  error: {}
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_WORKLOAD:
      return {
        ...state,
        workloads: payload,
        loading: false
      };
    case WORKLOAD_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null
      };
    default:
      return state;
  }
}
