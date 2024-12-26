import React from 'react';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../services/firebaseconfig'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { CheckCircle as VerifiedIcon, Cancel as UnverifiedIcon } from '@mui/icons-material';

const BadgeVerification = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, 'employees'));
      setEmployees(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchEmployees();
  }, []);

  const verifyBadge = async (id, verified) => {
    await updateDoc(doc(FIREBASE_DB, 'employees', id), { verified });
    setEmployees((prev) => prev.map((employee) => (employee.id === id ? { ...employee, verified } : employee)));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Verify Police Badges
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Badge Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.badge}</TableCell>
                <TableCell>{employee.verified ? 'Verified' : 'Unverified'}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => verifyBadge(employee.id, !employee.verified)}
                    color={employee.verified ? 'success' : 'error'}
                  >
                    {employee.verified ? <VerifiedIcon /> : <UnverifiedIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BadgeVerification;
