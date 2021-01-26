require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

// For the server to be able to parse the body request to json
app.use(express.json())

// Simulates refreshTokens stored in Db
let refreshTokens = []

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}

app.post('/login', (req, res) => {
    // TODO: Authenticate user.

    const username = req.body.username
    const user = {name: username}
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

    refreshTokens.push(refreshToken)

    res.json({accessToken, refreshToken})
})

app.post('/token', (req, res) => {
    const refreshToken = res.body.token
    if(!refreshToken){
        return res.sendStatus(401) // Not authenticated
    }
    if(refreshTokens.includes(refreshToken)){
        return res.sendStatus(403) // Not authorized
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403)
        }
        const accessToken = generateAccessToken({name: user.name})
        res.json(accessToken)
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.listen(9998)