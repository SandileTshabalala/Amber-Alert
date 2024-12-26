// src/screens/Settings.jsx

import React, { useState, useEffect } from 'react';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import { FIREBASE_AUTH, FIREBASE_DB } from '../services/firebaseconfig';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Settings = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch current user settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          const userSettingsRef = doc(FIREBASE_DB, 'usersSettings', user.uid);
          const userSettingsSnap = await getDoc(userSettingsRef);
          if (userSettingsSnap.exists()) {
            const data = userSettingsSnap.data();
            setEmail(user.email);
            setNotificationEnabled(data.notificationEnabled ?? true);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  // Update email and password
  const handleUpdateSettings = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      setSnackbarMessage('No user is signed in');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      // Update additional settings
      const userSettingsRef = doc(FIREBASE_DB, 'usersSettings', user.uid);
      await setDoc(userSettingsRef, { notificationEnabled });

      setSnackbarMessage('Settings updated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating settings:', error);
      setSnackbarMessage('Error updating settings');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <h2>Settings</h2>
      <TextField
        margin="dense"
        label="Email"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="dense"
        label="Current Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        margin="dense"
        label="New Password"
        type="password"
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <TextField
        margin="dense"
        label="Notification Preferences"
        type="checkbox"
        checked={notificationEnabled}
        onChange={(e) => setNotificationEnabled(e.target.checked)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateSettings}
        style={{ marginTop: '20px' }}
      >
        Update Settings
      </Button>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Settings;
