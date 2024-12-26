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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { FIREBASE_DB } from '../services/firebaseconfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Default values for employee
const defaultEmployee = {
  name: '',
  surname: '',
  badgeNumber: '',
  email: '',
  province: '',
  role: 'police', 
  departmentName: '',
};

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(defaultEmployee);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch employees from Firestore
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesCollection = collection(FIREBASE_DB, 'police_users');
        const employeesSnapshot = await getDocs(employeesCollection);
        const employeesList = employeesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeesList);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Add a new employee
  const handleAddEmployee = async () => {
    try {
      await addDoc(collection(FIREBASE_DB, 'police_users'), currentEmployee);
      setEmployees((prevEmployees) => [...prevEmployees, currentEmployee]);
      setCurrentEmployee(defaultEmployee);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  // Update an existing employee
  const handleUpdateEmployee = async () => {
    try {
      const employeeRef = doc(FIREBASE_DB, 'police_users', currentEmployee.id);
      await updateDoc(employeeRef, currentEmployee);
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === currentEmployee.id ? currentEmployee : emp
        )
      );
      setCurrentEmployee(defaultEmployee);
      setOpenDialog(false);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // Delete an employee
  const handleDeleteEmployee = async (employeeId) => {
    try {
      const employeeRef = doc(FIREBASE_DB, 'police_users', employeeId);
      await deleteDoc(employeeRef);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== employeeId)
      );
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Open dialog for adding or editing
  const handleOpenDialog = (employee = defaultEmployee) => {
    setCurrentEmployee(employee);
    setOpenDialog(true);
    setIsEditMode(!!employee.id);
  };

  return (
    <div>
      <h2>Manage Employees</h2>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpenDialog()}
      >
        Add Employee
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Surname</TableCell>
              <TableCell>Badge Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Province</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.surname}</TableCell>
                <TableCell>{employee.badgeNumber}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.province}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.departmentName}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(employee)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Add/Edit Employee */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {isEditMode ? 'Edit Employee' : 'Add Employee'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEditMode ? 'Edit the employee details below.' : 'Enter the employee details below.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={currentEmployee.name}
            onChange={(e) =>
              setCurrentEmployee({ ...currentEmployee, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Surname"
            type="text"
            fullWidth
            value={currentEmployee.surname}
            onChange={(e) =>
              setCurrentEmployee({ ...currentEmployee, surname: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Badge Number"
            type="text"
            fullWidth
            value={currentEmployee.badgeNumber}
            onChange={(e) =>
              setCurrentEmployee({ ...currentEmployee, badgeNumber: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={currentEmployee.email}
            onChange={(e) =>
              setCurrentEmployee({ ...currentEmployee, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Province"
            type="text"
            fullWidth
            value={currentEmployee.province}
            onChange={(e) =>
              setCurrentEmployee({ ...currentEmployee, province: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={currentEmployee.role}
              onChange={(e) =>
                setCurrentEmployee({ ...currentEmployee, role: e.target.value })
              }
            >
              <MenuItem value="police">Police</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              {/* Add more roles as needed */}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Department Name"
            type="text"
            fullWidth
            value={currentEmployee.departmentName}
            onChange={(e) =>
              setCurrentEmployee({
                ...currentEmployee,
                departmentName: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={isEditMode ? handleUpdateEmployee : handleAddEmployee}
            color="primary"
          >
            {isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageEmployees;
