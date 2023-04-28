const express = require("express");
const app = express();
const PORT = 3333
const cors = require('cors')
let corsOptions = {
  origin: 'https://passwordmanager-production-a98e.up.railway.app/',
}

app.get("/heartbeat", cors(corsOptions),(req, res) => {
  res.send("Heartbeat");
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

module.exports = app;