import React from 'react';
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../services/firebaseconfig';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

const CaseManagement = () => {
  const [cases, setCases] = useState([]);
  const [editingCase, setEditingCase] = useState(null);
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchCases = async () => {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, 'cases'));
      setCases(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchCases();
  }, []);

  const addCase = async (data) => {
    try {
      await addDoc(collection(FIREBASE_DB, 'cases'), data);
      setCases((prev) => [...prev, data]);
      reset();
    } catch (error) {
      console.error('Error adding case:', error);
    }
  };

  const deleteCase = async (id) => {
    try {
      await deleteDoc(doc(FIREBASE_DB, 'cases', id));
      setCases((prev) => prev.filter((caseItem) => caseItem.id !== id));
    } catch (error) {
      console.error('Error deleting case:', error);
    }
  };

  const editCase = (caseItem) => {
    setEditingCase(caseItem);
    setOpen(true);
  };

  const updateCase = async (data) => {
    try {
      await updateDoc(doc(FIREBASE_DB, 'cases', editingCase.id), data);
      setCases((prev) =>
        prev.map((caseItem) => (caseItem.id === editingCase.id ? { ...caseItem, ...data } : caseItem))
      );
      setOpen(false);
      setEditingCase(null);
      reset();
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Case Management
      </Typography>
      <form onSubmit={handleSubmit(editingCase ? updateCase : addCase)}>
        <Box display="flex" mb={2}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="Case Name" variant="outlined" sx={{ mr: 2 }} />
            )}
          />
          <Controller
            name="status"
            control={control}
            defaultValue="ongoing"
            render={({ field }) => (
              <TextField {...field} label="Status" variant="outlined" sx={{ mr: 2 }} />
            )}
          />
          <Button type="submit" variant="contained" color="primary">
            {editingCase ? 'Update Case' : 'Add Case'}
          </Button>
        </Box>
      </form>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Case Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell>{caseItem.name}</TableCell>
                <TableCell>{caseItem.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => editCase(caseItem)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteCase(caseItem.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Case</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(updateCase)}>
            <Controller
              name="name"
              control={control}
              defaultValue={editingCase?.name || ''}
              render={({ field }) => (
                <TextField {...field} label="Case Name" variant="outlined" fullWidth sx={{ mb: 2 }} />
              )}
            />
            <Controller
              name="status"
              control={control}
              defaultValue={editingCase?.status || 'ongoing'}
              render={({ field }) => (
                <TextField {...field} label="Status" variant="outlined" fullWidth sx={{ mb: 2 }} />
              )}
            />
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CaseManagement;
