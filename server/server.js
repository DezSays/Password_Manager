require('dotenv').config();
const express = require('express')
const pgp = require('pg-promise')();

const app = express()
const PORT = 3003
const db = pgp(process.env.DB)

app.get('/heartbeat', (req,res) => {
    res.send('Heartbeat Steady')
})

app.get('/users', async (req, res) => {
    const userData = await db.manyOrNone('SELECT * FROM users')
    res.json(userData)
})

app.get('/passwords', async (req, res) => {
    const passwordData = await db.manyOrNone('SELECT * FROM passwords')
    res.json(passwordData)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})