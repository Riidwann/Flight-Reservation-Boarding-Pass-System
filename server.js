const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  ✈️  SkyPass Airlines Server is running!`);
  console.log(`  🌐  Web Portal: http://localhost:${PORT}`);
  console.log(`  📊  Health API: http://localhost:${PORT}/api/health`);
  console.log(`  🧪  Ready for Apache JMeter System Testing`);
  console.log(`=======================================================`);
});

module.exports = server;
