const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ───────────────────────────────────────────────────────────────
const employeeRoutes = require('./routes/employeeRoutes');
const assetRoutes    = require('./routes/assetRoutes');

app.use('/api/employees', employeeRoutes);
app.use('/api/assets',    assetRoutes);

// Uncomment as additional routes are built:
// app.use('/api/payroll',    require('./routes/payrollRoutes'));
// app.use('/api/maintenance',require('./routes/assetMaintenanceRoutes'));
// app.use('/api/transfers',  require('./routes/assetTransferRoutes'));
// app.use('/api/disposals',  require('./routes/assetDisposalRoutes'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Payroll Management System API is running.' });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── DB Connection → Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // Exit so the process manager can restart cleanly
  });
