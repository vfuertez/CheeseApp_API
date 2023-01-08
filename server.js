require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const { PORT = 3000, DATABASE_URL } = process.env

mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

mongoose.connection
  .on('open', () => console.log('You are connected to mongoose'))
  .on('close', () => console.log('You are disconnected from mongoose'))
  .on('error', (error) => console.log(error))

const CheeseSchema = new mongoose.Schema({
  name: String,
  image: String,
  type: String,
})

const Cheese = mongoose.model('Cheese', CheeseSchema)

///// MIDDLEWARE /////

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

///// ROUTES /////

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/cheese', async (req, res) => {
    try {
        res.json(await Cheese.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.post('/cheese', async (req, res) => {
    try {
        res.json(await Cheese.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.put('/cheese/:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new:true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.delete("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id) )
    } catch (error) {
        res.status(400).json(error)
    }
})

app.get('/cheese/:id', async (req, res) => {
    try {
        res.json(await Cheese.findById(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})


///// LISTENER /////
app.listen(PORT, (req, res) => console.log(`Listening to ${PORT}`))
