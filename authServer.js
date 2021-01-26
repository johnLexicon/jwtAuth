require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

// For the server to be able to parse the body request to json
app.use(express.json())

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}

app.post('/login', (req, res) => {
    // TODO: Authenticate user.

    const username = req.body.username
    const user = {name: username}
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

    res.json({accessToken, refreshToken})
})

app.listen(9998)