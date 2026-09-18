require('dotenv').config();
const dns=require("dns")
dns.setServers(['1.1.1.1','8.8.8.8'])

const app = require('./src/app');
const connectDB = require('./src/db/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
