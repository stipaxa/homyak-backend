express = require('express')
morgan = require('morgan')
mongoose = require('mongoose')
cors = require('cors')
jwt = require('jsonwebtoken')
jwkToPem = require('jwk-to-pem')
axios = require('axios')
require('dotenv').config()
Note = require('./models/note')

const app = express()
const port = 3000

//in order to parse POST JSON
app.use(express.json())
app.use(morgan('combined'))

let myIDkeys = null
axios.get(process.env.MYID_URL).then((resp) => {
    myIDkeys = resp.data
})

app.use(
    cors({
        origin: process.env.CORS_ALLOWED_ORIGINS
            ? process.env.CORS_ALLOWED_ORIGINS.split(' ')
            : '*',
        credentials: true,
    })
)

mongoose.connect(process.env.MONGO_URL).catch(function (err) {
    console.log(err)
})

app.listen(port, function () {
    console.log(`...Server started on port ${port}...`)
})

app.get('/ping', async function (req, res) {
    res.status(200).send()
})

app.get('/test', async function (req, res) {
    const u = getUserName(req)
    res.status(200).send(u)
})

// Create note
app.post('/notes', async function (req, res) {
    try {
        const note = new Note({
            author: req.body.author,
            createdAt: Date.now(),
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
        })
        const id = (await note.save()).id
        res.status(200).send(id)
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

// Read note
app.get('/notes/:id', async function (req, res) {
    try {
        const note = await Note.find({
            author: getUserName(req),
            _id: req.params.id,
        })
        console.log(note)

        const result = {
            id: note.id,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            title: note.title,
            text: note.text,
            tags: note.tags,
        }
        res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

// Delete note
app.delete('/notes/:id', async function (req, res) {
    try {
        await Note.deleteOne({ _id: req.params.id })
        res.status(200).send()
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

// Update note
app.put('/notes/:id', async function (req, res) {
    try {
        await Note.findByIdAndUpdate({ _id: req.params.id }, req.body)
        res.status(200).send()
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

// List notes
app.get('/notes', async function (req, res) {
    try {
        const all_notes = await Note.find({ author: getUserName(req) })
        const result = all_notes.map((n) => {
            return {
                id: n.id,
                createdAt: n.createdAt,
                updatedAt: n.updatedAt,
                title: n.title,
                text: n.text,
                tags: n.tags,
            }
        })
        res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

// return username from JWT or throw exception
function getUserName(req) {
    const token = req.get('Authorization').split(' ')[1]
    const { username, token_use } = jwt.verify(
        token,
        jwkToPem(myIDkeys.keys[0]),
        {
            algirithms: ['RS256'],
        }
    )
    if (token_use !== 'access') {
        throw new Error('invalid token use')
    }
    //console.log(JSON.stringify(decoded_token, null, 2))

    return username
}
