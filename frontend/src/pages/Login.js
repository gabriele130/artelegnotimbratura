import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box, Paper } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import Logo from './logo.png'; // Import your logo

const Access = () => {
  const [identificativo, setIdentificativo] = useState('');
  const navigate = useNavigate();

  const handleAccess = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://artelegno-backend-46e49583886d.herokuapp.com/api/auth/access', {
        id: identificativo,
      });
  
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token); 
        localStorage.setItem('userName', response.data.name); 
        toast.success(`Benvenuto, ${response.data.name}!`);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Errore durante l\'accesso');
    }
  };
  


  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          <img src={Logo} alt="Logo" style={{ width: '120px', marginBottom: '20px' }} /> {/* Adjust logo size */}
        </Box>
        <Typography variant="h5" align="center" gutterBottom>
          Benvenuto
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
          Accedi con il tuo identificativo
        </Typography>
        <form onSubmit={handleAccess} style={{ marginTop: '20px' }}>
          <TextField
            label="Identificativo"
            variant="outlined"
            fullWidth
            value={identificativo}
            onChange={(e) => setIdentificativo(e.target.value)}
            margin="normal"
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
          >
            Accedi
          </Button>
        </form>
      </Paper>
      <ToastContainer />
    </Container>
  );
};

export default Access;
