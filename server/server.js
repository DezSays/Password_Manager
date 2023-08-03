const express = require('express')


const app = express()
const PORT = 3003

app.get('/heartbeat', (req,res) => {
    res.send('Heartbeat Steady')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})