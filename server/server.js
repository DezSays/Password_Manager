const express = require("express");
const app = express();
const PORT = 3333
const cors = require('cors')
app.use(cors())

app.get("/heartbeat", (req, res) => {
  res.send("Heartbeat");
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});

module.exports = app;