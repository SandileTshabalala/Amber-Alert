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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { FIREBASE_DB } from '../services/firebaseconfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Default values for report
const defaultReport = {
  title: '',
  description: '',
  date: '',
  status: '',
  relatedCaseId: ''
};

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentReport, setCurrentReport] = useState(defaultReport);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsCollection = collection(FIREBASE_DB, 'reports');
        const reportsSnapshot = await getDocs(reportsCollection);
        const reportsList = reportsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsList);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  // Add a new report
  const handleAddReport = async () => {
    try {
      await addDoc(collection(FIREBASE_DB, 'reports'), currentReport);
      setReports((prevReports) => [...prevReports, currentReport]);
      setCurrentReport(defaultReport);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding report:', error);
    }
  };

  // Update an existing report
  const handleUpdateReport = async () => {
    try {
      const reportRef = doc(FIREBASE_DB, 'reports', currentReport.id);
      await updateDoc(reportRef, currentReport);
      setReports((prevReports) =>
        prevReports.map((rep) =>
          rep.id === currentReport.id ? currentReport : rep
        )
      );
      setCurrentReport(defaultReport);
      setOpenDialog(false);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  // Delete a report
  const handleDeleteReport = async (reportId) => {
    try {
      const reportRef = doc(FIREBASE_DB, 'reports', reportId);
      await deleteDoc(reportRef);
      setReports((prevReports) =>
        prevReports.filter((rep) => rep.id !== reportId)
      );
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const handleOpenDialog = (report = defaultReport) => {
    setCurrentReport(report);
    setOpenDialog(true);
    setIsEditMode(!!report.id);
  };

  return (
    <div>
      <h2>Reports</h2>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpenDialog()}
      >
        Add Report
      </Button>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Related Case ID</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.status}</TableCell>
                <TableCell>{report.relatedCaseId}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(report)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteReport(report.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {isEditMode ? 'Edit Report' : 'Add Report'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEditMode ? 'Edit the report details below.' : 'Enter the report details below.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={currentReport.title}
            onChange={(e) =>
              setCurrentReport({ ...currentReport, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={currentReport.description}
            onChange={(e) =>
              setCurrentReport({ ...currentReport, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentReport.date}
            onChange={(e) =>
              setCurrentReport({ ...currentReport, date: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Status"
            type="text"
            fullWidth
            value={currentReport.status}
            onChange={(e) =>
              setCurrentReport({ ...currentReport, status: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Related Case ID"
            type="text"
            fullWidth
            value={currentReport.relatedCaseId}
            onChange={(e) =>
              setCurrentReport({ ...currentReport, relatedCaseId: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={isEditMode ? handleUpdateReport : handleAddReport}
            color="primary"
          >
            {isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Reports;
