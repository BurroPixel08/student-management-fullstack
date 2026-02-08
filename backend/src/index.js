const express = require('express');
const studentRoutes = require('./routes/student-routes');
const sequelize = require('./database/db-config');

const app = express();
const PORT = 3000;

app.use(express.json());

// Conneting routes
app.use('/api/students', studentRoutes);

const start = async () => {
  try {
    await sequelize.authenticate();
    app.listen(PORT, () => {
      console.log(`Server ready on http://localhost:${PORT}/api/students`);
    });
  } catch (err) {
    console.error('Error connecting to DB: ', err);
  }
};

start();