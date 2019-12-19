const express = require('express')
const db = require('./data/dbConfig')

const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        res.json(await db.select('*').from('accounts'))
    } catch (err) {
        next(err)
    }
})

router.get('/:id', validateAccountId, async (req, res, next) => {
    try {
        res.json(await db('accounts').where('id', req.params.id).first())
    } catch (err) {
        next(err)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const payload = {
            name: req.body.name,
            budget: req.body.budget
        }
        res.json(await db('accounts').insert(payload))
    } catch (err) {
        next(err)
    }
})

router.put('/:id', validateAccountId, async (req, res, next) => {
    try {
        const payload = {
            name: req.body.name,
            budget: req.body.budget
        }
        await db('accounts').where('id', req.params.id).update(payload)
        res.json(await db('accounts').where('id', req.params.id).first())
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', validateAccountId, async (req, res, next) => {
    try {
        await db('accounts').where('id', req.params.id).del()
        res.status(200).json({message: 'Account successfully deleted!'})
    } catch (err) {
        next(err)
    }
})

async function validateAccountId (req, res, next) {
    try {
        const account = await db('accounts').where('id', req.params.id).first()
        if (account) {
            next()
        } else {
            res.status(404).json({message: 'Account not found!'})
        }
    } catch (err) {
        next(err)
    }
}

module.exports = router