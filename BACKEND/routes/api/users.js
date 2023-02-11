const express = require('express')
const { check, validationResult } = require('express-validator');
const router = express.Router()
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include valid email').isEmail(),
    check('password', 'Please enter password with 8 or more characters').isLength({ min: 8 })
], 
async (req, res) => {
    const errors = validationResult(req)
    console.log(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
        let user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
        }

        const avatar = gravatar.url( email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        
        user = new User({
            name,
            email,
            avatar,
            password
        })

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash( password, salt )

        await user.save()

        const payload = {
            user: {
                id: user.id 
            }
        }

        jwt.sign( payload, config.get('jwtSecret'), { expiresIn: 7200 }, (err, token) => {
            if (err) throw err
            res.json({ token })
        } )

    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }

})

module.exports = router