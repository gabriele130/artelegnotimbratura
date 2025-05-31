import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/attendance/logs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setLogs(response.data);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Errore nel recupero dei log:', error);
        navigate('/login');
      }
    };

    fetchLogs();
  }, [navigate]);

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Log di Timbratura
      </Typography>
      <List>
        {Array.isArray(logs) && logs.length > 0 ? (
          logs.map((log) => (
            <ListItem key={log._id}>
              <ListItemText
                primary={`Data: ${log.date}`}
                secondary={
                  Array.isArray(log.records) ? (
                    log.records.map((record, index) => (
                      <div key={index}>
                        <strong>Tipo:</strong> {record.type} - <strong>Ora:</strong> {new Date(record.timestamp).toLocaleString()}
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">Nessun record disponibile</Typography>
                  )
                }
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">Nessun log disponibile</Typography>
        )}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackToHome}
        fullWidth
        sx={{ mt: 2 }}
      >
        Torna alla Home
      </Button>
    </Container>
  );
};

export default Logs;
