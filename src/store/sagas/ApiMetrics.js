import { takeEvery, call, put, cancel } from "redux-saga/effects";
import * as actions from "../actions";
import api from "../api";

function* fetchMetrics(action) {
  const { data, error } = yield call(api.fetchMetrics);
  if (error) {
    yield put({ type: actions.API_ERROR, error: error.errors[0].message });
    yield cancel();
  }
  yield put({ type: actions.METRICS_RECEIVED, metrics: data.getMetrics });
}

function* watchApiCalls() {
  yield takeEvery(actions.FETCH_METRICS, fetchMetrics);
}

export default [watchApiCalls];
