import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, CircularProgress, Box, Paper } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useSpring, animated } from '@react-spring/web';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';
import Clock from './Clock';
import Footer from './Footer';

// Funzione per calcolare la distanza tra due coordinate
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raggio della Terra in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Funzione per verificare se l'utente è all'interno dell'area di geofencing
function isWithinGeofence(currentLat, currentLng, targetLat, targetLng, radiusInKm) {
  const distance = calculateDistance(currentLat, currentLng, targetLat, targetLng);
  return distance <= radiusInKm;
}

// Funzione per ottenere la posizione dell'utente con geolocalizzazione
function getGeolocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalizzazione non supportata dal tuo browser.'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        (error) => {
          reject(new Error('Impossibile ottenere la posizione attuale.'));
        }
      );
    }
  });
}

const Home = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Recupera il nome dell'utente dal localStorage
  const userName = localStorage.getItem('userName');

  const [style, api] = useSpring(() => ({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 300, friction: 20 },
  }));

  const handleLogout = () => {
    // Rimuovi il token e il nome utente dal localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    // Reindirizza l'utente alla pagina di login
    navigate('/login');
  };

  const handleTimbratura = async (type) => {
    if (loading) return;
    setLoading(true);
    
    try {
      const { latitude, longitude } = await getGeolocation();
      const aziendaLat = 36.72790916037533;
      const aziendaLng = 14.793061649455767;
      const radiusInKm = 4.0;

      if (!isWithinGeofence(latitude, longitude, aziendaLat, aziendaLng, radiusInKm)) {
        toast.error('Sei fuori dall’area consentita per timbrare.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Non sei autenticato. Effettua il login.');
        navigate('/login');
        return;
      }

      console.log(`Request URL: ${process.env.REACT_APP_API_URL}api/attendance/timbratura`);

      const apiUrl = process.env.REACT_APP_API_URL.trim(); // Rimuove eventuali spazi bianchi o newline
      console.log(`Trimmed API URL: ${apiUrl}`); // Log dell'API URL dopo il trim
      const response = await axios.post(`${apiUrl}/api/attendance/timbratura`, { type }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.status === 201) {
        toast.success(response.data.message);
      } else {
        if (response.status === 401) {
          toast.error('Sessione scaduta. Effettua nuovamente il login.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Errore durante la timbratura');
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Contenitore principale per il contenuto della pagina */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper 
          elevation={10} 
          sx={{ padding: 4, borderRadius: 5, width: '100%', background: 'linear-gradient(135deg, #ece9e6, #ffffff)' }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
            sx={{ position: 'absolute', top: '20px', right: '20px' }}
          >
            Logout
          </Button>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h6" component="p" sx={{ mb: 2 }}>
              {userName}
            </Typography>
            {/* Placeholder for Clock Component */}
          </Box>
          <animated.div style={style}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Registrazione Entrata/Uscita
            </Typography>
            <Link to="/logs" style={{ textAlign: 'center', display: 'block', marginTop: '20px', marginBottom: '40px', color: '#1976d2', textDecoration: 'none' }}>
              Visualizza Log di Timbratura
            </Link>
            <Box className="button-group">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleTimbratura('entrata')}
                disabled={loading}
                fullWidth
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Registra Entrata'}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleTimbratura('uscita')}
                disabled={loading}
                fullWidth
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Registra Uscita'}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleTimbratura('entrata_pausa')}
                disabled={loading}
                fullWidth
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Registra Entrata Pausa'}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleTimbratura('uscita_pausa')}
                disabled={loading}
                fullWidth
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Registra Uscita Pausa'}
              </Button>
            </Box>
          </animated.div>
          <ToastContainer />
        </Paper>
      </Box>
  
      {/* Footer sempre in basso */}
      <Footer />
    </Container>
  );
};

export default Home;
