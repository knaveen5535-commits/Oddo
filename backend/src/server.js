require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5001;

// Connect to Database (non-blocking)
connectDB().catch(err => {
  console.warn('Database initialization warning:', err.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
