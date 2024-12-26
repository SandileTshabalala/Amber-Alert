import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Container, Typography, Paper } from '@mui/material';

// fake data
const data = [
  { name: 'Jan', cases: 4000 },
  { name: 'Feb', cases: 3000 },
  { name: 'Mar', cases: 5000 },
  { name: 'Apr', cases: 7000 },
  { name: 'May', cases: 6000 },
  { name: 'Jun', cases: 8000 },
];

const Analytics = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Analytics Overview
      </Typography>
      <Paper style={{ padding: 20 }}>
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cases" fill="#8884d8" />
        </BarChart>
      </Paper>
    </Container>
  );
};

export default Analytics;
