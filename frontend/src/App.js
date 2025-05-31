import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Logs from './pages/Logs';
import Login from './pages/Login';

function App() {
  // Controllo se l'utente è autenticato
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Rotte pubbliche */}
        <Route path="/login" element={<Login />} />

        {/* Rotte protette */}
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/logs"
          element={isAuthenticated ? <Logs /> : <Navigate to="/login" replace />}
        />

        {/* Rotta di fallback in caso di URL non validi */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
