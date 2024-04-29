import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'
import axios from 'axios'
import 'dotenv/config'
import Note from './models/note.js'

const app = express()
const port = 3000

//in order to parse POST JSON
app.use(express.json())
app.use(morgan('combined'))

let jwksFromID = {
    keys: [],
}

app.use(
    cors({
        origin: process.env.CORS_ALLOWED_ORIGINS
            ? process.env.CORS_ALLOWED_ORIGINS.split(' ')
            : '*',
        credentials: true,
    })
)

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URL).catch(function (err) {
    console.log(err)
})

app.listen(port, function () {
    console.log(`...Server started on port ${port}...`)
})

app.get('/ping', async function (req, res) {
    res.status(200).send()
})

// Create note
app.post('/api/backend/notes', async function (req, res) {
    try {
        const note = new Note({
            author: await getUserName(req),
            createdAt: Date.now(),
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
        })
        const id = (await note.save()).id
        const result = {
            id,
            createdAt: note.createdAt,
            updatedAt: note.createdAt,
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

// Read note
app.get('/api/backend/notes/:id', async function (req, res) {
    try {
        const note = await Note.findOne({
            author: await getUserName(req),
            _id: req.params.id,
        })

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
app.delete('/api/backend/notes/:id', async function (req, res) {
    try {
        await Note.deleteOne({
            author: await getUserName(req),
            _id: req.params.id,
        })
        res.status(204).send()
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

// Update note
app.put('/api/backend/notes/:id', async function (req, res) {
    try {
        // Update
        const fieldsToBeUpdated = { ...req.body, updatedAt: Date.now() }
        await Note.findByIdAndUpdate({ _id: req.params.id }, fieldsToBeUpdated)

        // Return the updated note
        const note = await Note.findOne({
            author: await getUserName(req),
            _id: req.params.id,
        })
        if (!note) throw new Error('note not found')

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

// List notes
app.get('/api/backend/notes', async function (req, res) {
    try {
        const all_notes = await Note.find({ author: await getUserName(req) })
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

async function getJwk(token) {
    const kid = jwt.decode(token, { complete: true }).header.kid

    let jwk = jwksFromID.keys.find((k) => k.kid === kid)
    if (!jwk) {
        jwksFromID = (await axios.get(process.env.MYID_URL)).data
    }
    jwk = jwksFromID.keys.find((k) => k.kid === kid)
    if (!jwk) {
        throw new Error('Ooops')
    }

    return jwk
}

// return username from JWT or throw exception
async function getUserName(req) {
    const token = req.get('Authorization').split(' ')[1]
    const jwk = await getJwk(token)
    const { username, token_use } = verifyToken(token, jwk)

    if (token_use !== 'access') {
        throw new Error('invalid token use')
    }

    return username
}

function verifyToken(token, jwk) {
    if (jwk === null) {
        throw new Error('Oooops')
    }

    const keyPEM = jwkToPem(jwk)
    const decoded_token = jwt.verify(token, keyPEM)
    return decoded_token
}
