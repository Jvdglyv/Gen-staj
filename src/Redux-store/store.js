import { configureStore } from '@reduxjs/toolkit';
import patientReducer from '../PatientSlicer/patientSlice';
import appReducer from '../AppSlice';

const store = configureStore({
  reducer: {
    app: appReducer,
    patients: patientReducer,
  },
  
});

export default store;