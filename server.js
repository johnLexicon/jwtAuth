const express = require('express')
const { reset } = require('nodemon')
const app = express()

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
    return res.send("Hello World!!")
})

app.get('/products', (req, res) => {
    return res.json(products)
})


app.listen(9999)