require('dotenv').config();
const express = require('express');
const connectToDB = require('./database/db');
const authRoutes = require('./routes/auth-routes')
const homeRoutes = require('./routes/home-routes')
const adminRoutes = require('./routes/admin-routes')
const uploadImageRoutes = require('./routes/image-routes')


//INFO Connect to DB
connectToDB()

const app = express();
const PORT = process.env.PORT || 3000;

//INFO Middlewares
app.use(express.json());

//INFO Routes
app.use('/api/auth', authRoutes)
app.use('/api/home', homeRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/image', uploadImageRoutes)

app.listen(PORT, () => {
    console.log(`🚀 Server is now running on http://localhost:${PORT} ❤️`);
  }).on('error', (err) => {
    console.error('💥 Failed to start server:', err.message);
    process.exit(1);
  });
  