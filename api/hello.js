module.exports = async (req, res) => {
  res.json({
    message: 'Hello from Vercel API!',
    timestamp: new Date().toISOString()
  });
}; 