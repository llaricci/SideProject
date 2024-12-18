
import React from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

const ReusableModal = ({
  open,
  onClose,
  title,
  fields,
  setFieldValues,
  onSubmit,
}) => {
  const handleChange = (field, value) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 400,
          bgcolor: 'white',
          p: 3,
          boxShadow: 2,
        }}
      >
        <h3 className = 'text-black'>{title}</h3>
        {fields.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            fullWidth
            value={field.value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            margin="normal"
            type={field.type || 'text'}
          />
        ))}
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default ReusableModal;
