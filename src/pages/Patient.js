//#region importing all the things we need
import React, { useEffect,useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePagination } from '@mui/material';
import {getPatient}from '../PatientSlicer/patientSlice';
import CreatePatient from '../components/createPatient';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import DeletePatient from '../components/deletePatient';

//#endregion

//#region Table columns
const columns = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Full Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'birthdate', label: 'Birth Date' },
  { id: 'telecom', label: 'Telecom' },
];
//#endregion

//#region Css
const styles = {
  tableContainer: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  totalPatients: {
    color: '#5F9EA0',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  table: {
    minWidth: 500,
  },
  tableCell: {
    fontWeight: 'bold',
    borderBottom: '1px solid #ccc',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: '#f5f5f5',
      cursor: 'pointer',
    },
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  button: {
    margin: '0 0.5rem',
  },
};

//#endregion
//#region  initializing Selector and Dispatch
const Patient = () => {
  const dispatch = useDispatch();
  const {bundle} = useSelector((state) => state.patients);
  const [page, setPage] = useState(0);
  const [searchFirstName, setSearchFirstName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  const handleDeleteModalOpen = (patientId) => {
    setDeleteModalOpen(true);
    setPatientToDelete(patientId);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setPatientToDelete(null);
  };
  const handleSearch = () => {
    // Dispatch an action to search patients by first name and last name
    dispatch(
      getPatient({
        searchParams: {
          given: searchFirstName,
          family: searchLastName,
        },
      })
    );
  };
  useEffect(() => {
    dispatch(getPatient());
  }, [dispatch]);
  //#endregion
  //#region fetch data
  const handlePreviousPage = (lastBundle) => {
    dispatch(
      getPatient({
        searchType: "prev", bundle: lastBundle, searchParams: {},})
    );
  };
  const handleNextPage = (lastBundle) => {
    dispatch(
      getPatient({
        searchType: "next",bundle: lastBundle,searchParams: {},})
    );
  };
  //#endregion
  const handlePageChange = (event, newPage) => {
    if (newPage > page) {
      handleNextPage(bundle);
    } else if (newPage < page) {
      handlePreviousPage(bundle);
    }

    setPage(newPage);
  };

//#region Table
  return (
    <div style={styles.tableContainer}>
      <h1 style={{ color: '#5F9EA0', fontSize: '24px', fontWeight: 'bold' }}>
        Patient List
      </h1>
      <h1 style={styles.totalPatients}>
        Total: {bundle.total|| 0}
      </h1>
      <TextField
        label="Search by First Name"
        variant="outlined"
        value={searchFirstName}
        onChange={(e) => setSearchFirstName(e.target.value)}
      />
      <TextField
        label="Search by Last Name"
        variant="outlined"
        value={searchLastName}
        onChange={(e) => setSearchLastName(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
      <CreatePatient/>
      <TableContainer component={Paper}>
      <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={bundle.total || 0}
            page={page}
            rowsPerPage={Number(bundle?.entry?.length)}
            onPageChange={(event, newPage) => {
                handlePageChange(event, newPage);              
            }}
          />
        <Table style={styles.table}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} style={styles.tableCell}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bundle?.entry?.map((patient) => (
              <TableRow key={patient.resource.id} style={styles.tableRow}>
                <TableCell>{patient.resource.id}</TableCell>
                <TableCell>
                  {patient.resource.name?.[0]?.given?.[0] || ''}{' '}
                  {patient.resource.name?.[0]?.family || 'Na'}
                </TableCell>
                <TableCell>{patient.resource.gender || 'Na'}</TableCell>
                <TableCell>{patient.resource.birthDate || 'Na'}</TableCell>
                <TableCell>
                  {patient.resource.telecom?.[0]?.value || 'Na'}
                </TableCell>
                <TableCell>
                <CreatePatient patientId={patient.resource.id} />
                <Button
                  variant="contained"
                  color="secondary"
                  
                  onClick={() => handleDeleteModalOpen(patient.resource.id)}
                >
                  Delete
                </Button>
              </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {deleteModalOpen && (
      <DeletePatient
        patientId={patientToDelete}
        onClose={handleDeleteModalClose}
      />
    )}
      </TableContainer>
    </div>
  );
};

export default Patient;
//#endregion