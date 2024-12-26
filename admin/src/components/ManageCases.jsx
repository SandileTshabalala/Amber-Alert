import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { FIREBASE_DB } from '../services/firebaseconfig'; 
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'; 

const ManageCases = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const casesCollection = collection(FIREBASE_DB, 'alerts'); // Reference to the cases collection
        const casesSnapshot = await getDocs(casesCollection);
        const casesList = casesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),//spread operator
        }));
        setCases(casesList);
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };

    fetchCases();
  }, []);

  const handleResolveCase = async (caseId) => {
    try {
      const caseRef = doc(FIREBASE_DB, 'alerts', caseId); // Reference to the specific document
      await updateDoc(caseRef, { status: 'resolved' });
      setCases((prevCases) =>
        prevCases.map((caseItem) =>
          caseItem.id === caseId ? { ...caseItem, status: 'resolved' } : caseItem
        )
      );
    } catch (error) {
      console.error('Error resolving case:', error);
    }
  };

  const handleDeleteCase = async (caseId) => {
    try {
      const caseRef = doc(FIREBASE_DB, 'alerts', caseId); // Reference to the specific document
      await deleteDoc(caseRef);
      setCases((prevCases) => prevCases.filter((caseItem) => caseItem.id !== caseId));
    } catch (error) {
      console.error('Error deleting case:', error);
    }
  };

  return (
    <div>
      <h2>Manage Cases</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Case ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell>{caseItem.id}</TableCell>
                <TableCell>{caseItem.title}</TableCell>
                <TableCell>{caseItem.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={caseItem.status === 'resolved' ? 'success' : 'primary'}
                    onClick={() => handleResolveCase(caseItem.id)}
                  >
                    {caseItem.status === 'resolved' ? 'Resolved' : 'Resolve'}
                  </Button>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteCase(caseItem.id)}
                  >
                    <Delete />
                  </IconButton>
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default ManageCases;
