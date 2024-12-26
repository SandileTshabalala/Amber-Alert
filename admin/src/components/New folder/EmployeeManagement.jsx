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

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, 'employees'));
      setEmployees(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchEmployees();
  }, []);

  const addEmployee = async (data) => {
    await addDoc(collection(FIREBASE_DB, 'employees'), data);
    setEmployees((prev) => [...prev, data]);
    reset();
  };

  const deleteEmployee = async (id) => {
    await deleteDoc(doc(FIREBASE_DB, 'employees', id));
    setEmployees((prev) => prev.filter((employee) => employee.id !== id));
  };

  const editEmployee = (employee) => {
    setEditingEmployee(employee);
    setOpen(true);
  };

  const updateEmployee = async (data) => {
    await updateDoc(doc(FIREBASE_DB, 'employees', editingEmployee.id), data);
    setEmployees((prev) => prev.map((employee) => (employee.id === editingEmployee.id ? { ...employee, ...data } : employee)));
    setEditingEmployee(null);
    setOpen(false);
    reset();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Employees
      </Typography>
      <form onSubmit={handleSubmit(editingEmployee ? updateEmployee : addEmployee)}>
        <Controller
          name="name"
          control={control}
          defaultValue={editingEmployee ? editingEmployee.name : ''}
          render={({ field }) => <TextField {...field} label="Employee Name" variant="outlined" required />}
        />
        <Controller
          name="badge"
          control={control}
          defaultValue={editingEmployee ? editingEmployee.badge : ''}
          render={({ field }) => <TextField {...field} label="Badge Number" variant="outlined" required />}
        />
        <Button type="submit" variant="contained" color="primary">
          {editingEmployee ? 'Update Employee' : 'Add Employee'}
        </Button>
      </form>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Badge Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.badge}</TableCell>
                <TableCell>
                  <IconButton onClick={() => editEmployee(employee)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteEmployee(employee.id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(updateEmployee)}>
            <Controller
              name="name"
              control={control}
              defaultValue={editingEmployee ? editingEmployee.name : ''}
              render={({ field }) => <TextField {...field} label="Employee Name" variant="outlined" required />}
            />
            <Controller
              name="badge"
              control={control}
              defaultValue={editingEmployee ? editingEmployee.badge : ''}
              render={({ field }) => <TextField {...field} label="Badge Number" variant="outlined" required />}
            />
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Update
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EmployeeManagement;
