require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

// For the server to be able to parse the body request to json
app.use(express.json())

const products = [
    {
        id: "1",
        name: "Product 1",
        price: 100
    },
    {
        id: "2",
        name: "Product 2",
        price: 200
    }
]

app.get('/', (req, res) => {
    res.send("Products path: /products")
})

app.get('/products', authenticateToken, (req, res) => {
    res.json(products)
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(!token){
        return res.sendStatus(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            res.sendStatus(403)
        }
        req.user = user
        next()
    })
}

app.post('/login', (req, res) => {
    // TODO: Authenticate user.

    const username = req.body.username
    const user = {name: username}
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

    res.json({accessToken})
})

app.listen(9999)