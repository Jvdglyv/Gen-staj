import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { createPatient,getPatient,updatePatient } from '../PatientSlicer/patientSlice';
import {patientSchema} from '../Validations/UserValidation';

const styles = {
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '4px',
    outline: 'none',
  },
  textField: {
    marginBottom: '1rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem',
  },
};

const CreatePatient = ({patientId}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    given: '',
    family:'',
    gender: '',
    birthDate: '',
    telecom: '',
  });
  const [formErrors, setFormErrors] = useState({});



  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    patientSchema
    .validate(formData, { abortEarly: false })
    .then(() => {
      const newPatient = {
        resourceType: 'Patient',
        name: [
          {
              family: formData.family,
              given: [formData.given],
          },
      ],
      gender: formData.gender,
      birthDate: formData.birthDate,
      telecom: [{ system: 'phone', value: formData.telecom }]
    };
    if (patientId) {
      dispatch(updatePatient(patientId,newPatient));
    } else {
      dispatch(createPatient(newPatient));
    }
  
    dispatch(getPatient(''));
    handleClose();
    })
    .catch((validationErrors) => {
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setFormErrors(errors);
    });
   
  };

  return (
    <div>
       <Button variant="contained" color="primary" onClick={handleOpen}>
        {patientId ? 'Update' : 'Create New Patient'}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-patient-modal"
        style={styles.modal}
      >
        <Box style={styles.modalContent}>
          <Typography variant="h6" id="create-patient-modal">
            Create New Patient
          </Typography>
          <TextField
            name="given"
            label="FirstName"
            variant="outlined"
            fullWidth
            style={styles.textField}
            value={formData.given}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                given: e.target.value,
              }))
            }
            error={Boolean(formErrors.given)}
            helperText={formErrors.given}
          />
          <TextField
            name="family"
            label="LastName"
            variant="outlined"
            fullWidth
            style={styles.textField}
            value={formData.family}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                family: e.target.value,
              }))
            }
            error={Boolean(formErrors.family)}
            helperText={formErrors.family}
          />
          <TextField
            name="gender"
            label="Gender"
            variant="outlined"
            fullWidth
            style={styles.textField}
            value={formData.gender}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                gender: e.target.value,
              }))
            }
            error={Boolean(formErrors.gender)}
            helperText={formErrors.gender}
          />
          <TextField
            name="birthDate"
            label="BirthDate"
            variant="outlined"
            fullWidth
            style={styles.textField}
            value={formData.birthDate}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                birthDate: e.target.value,
              }))
            }
            error={Boolean(formErrors.birthDate)}
            helperText={formErrors.birthDate}
          />
          <TextField
            name="telecom"
            label="Telecom"
            variant="outlined"
            fullWidth
            style={styles.textField}
            value={formData.telecom}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                telecom: e.target.value,
              }))
            }
            error={Boolean(formErrors.telecom)}
            helperText={formErrors.telecom}
          />
          <div style={styles.buttonContainer}>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CreatePatient;
