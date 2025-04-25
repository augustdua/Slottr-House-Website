const express = require('express');
const path = require('path');

const app = express();

// Define the port for the frontend server (make sure it's DIFFERENT from your backend API server port)
const PORT = process.env.PORT || 5300; // Example: Use port 3000 for the frontend

// Define the path to your static frontend files (the 'public' directory)
const publicDirectoryPath = path.join(__dirname, 'public');

// Serve static files from the 'public' directory
app.use(express.static(publicDirectoryPath));

// Fallback: Serve 'index.html' for any requests that don't match a file
// This is useful if you later add client-side routing (like React Router, Vue Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, 'index.html'));
});

// Start the frontend server
app.listen(PORT, () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
});