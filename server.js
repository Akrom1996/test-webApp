const express = require("express")
const user = require("./models/user")
var bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

const db = require("./models")
const {
    User
} = require("./models");

app.get('/', async (req, res) => {
    const data = await User.findAll()
    return res.status(200).json({
        data
    })
})

app.post('/user/withdraw/:userId', async (req, res) => {
    console.log(req.params, req.body)
    if (!req.params || !req.body.amount) {
        return res.status(400).json({
            error: 'Required variables are not given'
        })
    }
    try {
        const user = await User.findByPk(req.params.userId)
        if (!user)
            return res.status(400).json({
                error: 'User not found'
            })
        if (user.balance >= req.body.amount) {
            user.balance -= req.body.amount
            await user.save()
        } else {
            return res.status(400).json({
                error: 'You do not have enough money to withdraw'
            })
        }
        return res.status(200).json({
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
})

db.sequelize.sync().then((req) => {
    app.listen('3001', () => console.log('Server is running on port 3001'))
})