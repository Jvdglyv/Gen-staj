import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';
import Client from 'fhir-kit-client';

const url = 'https://hapi.fhir.org/baseR5/';

export const fhirClient = new Client({
  baseUrl: url,
});
const initialState = {
  bundle: {},
  loading: false,
  error: null,
};
export const searchPatients = createAsyncThunk('searchPatients', async (query) => {
  const response = await fhirClient.search({
    resourceType: 'Patient',
    searchParams: {
      _total: 'accurate',
    },
  });
  return response;
});
export const getPatient = createAsyncThunk('getPatient',
  async(params) =>{
  var type = params?.searchType;
  var searchParams = params?.searchParams;
  var lastbundle = params?.bundle;
  var response={};
  if (type === 'search') {
    response = await fhirClient.search({
      resourceType: 'Patient',
      searchParams: {
        ...searchParams,
        _total: 'accurate',
        name: `${searchParams.given || ''} ${searchParams.family || ''}`,
      },
    });
  }
  if(!type){
    type="self"
  }
  if (type === 'next') {
    response = await fhirClient.nextPage({bundle: lastbundle,});
  } else if (type === 'prev') {
    response = await fhirClient.prevPage({bundle: lastbundle,});
  } else {
    response = await fhirClient.search({
      resourceType: 'Patient',
      searchParams: { ...searchParams, _total:"accurate",},
    });
  }
  return response;
}
);
export const createPatient = createAsyncThunk('createPatient', async (patientData) => {
  const response = await fhirClient.create({
    resourceType: 'Patient',
    body: patientData,
  });

  return response;
});
export const deletePatient = createAsyncThunk('deletePatinet', async (id) => {
  const response = await fhirClient.delete({resourceType: 'Patient', id});
  return response
});

export const updatePatient = createAsyncThunk('updatePatinet', async (data) => {
  await fhirClient.update({
      resourceType: 'Patient', id: data.id?.[0], body: data
  });
});

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.bundle = action.payload;
      
      })
      .addCase(getPatient.rejected, (state, action) => {
        state.loading = false;
        state.bundle = {};
        state.error = action.error.message;
      })
      .addCase(createPatient.rejected,(state,action) => {
        console.log("action",action);
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.loading = false;
      });
      builder.addCase(updatePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
    });
    builder.addCase(updatePatient.fulfilled, (state, action) => {
      console.log("Update successful:", action.payload);
        state.loading = false;
    });
    builder.addCase(updatePatient.rejected, (state, action) => {
      console.log("Update failed:", action.error.message);
        state.error = action.error.message;
    });
  }
});
export default patientSlice.reducer;
