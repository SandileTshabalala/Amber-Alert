import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Grid, Paper, Typography } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../services/firebaseconfig';

const Dashboard = () => {
  const [superuser, setSuperuser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [ongoingCases, setOngoingCases] = useState(0);
  const [resolvedCases, setResolvedCases] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);

  // Check if the user is a superuser
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          setSuperuser(idTokenResult.claims.superuser || false);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const alertsCollection = collection(FIREBASE_DB, 'alerts');
        const alertsSnapshot = await getDocs(alertsCollection);
        const alerts = alertsSnapshot.docs.map((doc) => doc.data());
        setTotalAlerts(alerts.length);
        setOngoingCases(alerts.filter((alert) => alert.status === 'ongoing').length);
        setResolvedCases(alerts.filter((alert) => alert.status === 'resolved').length);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  // Fetch employees from Firestore
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesCollection = collection(FIREBASE_DB, 'police_users');
        const employeesSnapshot = await getDocs(employeesCollection);
        const employeesList = employeesSnapshot.docs.map((doc) => doc.data());
        setTotalEmployees(employeesList.length);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!superuser) return <p>Not authorized as superuser</p>;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome to Amber Alert Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Total Alerts</Typography>
            <Typography variant="h4">{totalAlerts}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Ongoing Cases</Typography>
            <Typography variant="h4" sx={{ color: 'red' }}>
              {ongoingCases}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Resolved Cases</Typography>
            <Typography variant="h4" sx={{ color: 'green' }}>
              {resolvedCases}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Employees</Typography>
            <Typography variant="h4">{totalEmployees}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
