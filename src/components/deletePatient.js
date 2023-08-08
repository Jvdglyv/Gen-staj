import React from 'react';
import { useDispatch } from 'react-redux';
import { deletePatient, getPatient } from '../PatientSlicer/patientSlice';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

const DeletePatient = ({ patientId, onClose }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    dispatch(deletePatient(patientId));
    dispatch(getPatient(''));
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this patient?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePatient;
