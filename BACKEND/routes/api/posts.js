const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile');

// To create posts
router.post('/', auth, [check('text', 'Text is required').not().isEmpty()], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password')

        const newPost = new Post({
            user: req.user.id,
            text: req.body.text,
            name: user.name,
            avatar: user.avatar
        })
        const post = await newPost.save()
        res.json(post)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

})

// To get all posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

// To get a single post
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.json(post)
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.status(500).send('Server Error')
    }
})

// To delete a user's post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }

        // Check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" })
        }

        await post.remove()
        res.json({ msg: "Post removed" })
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.status(500).send('Server Error')
    }
})

// To like a post
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }

        // Check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' })
        }

        post.likes.unshift({ user: req.user.id })

        await post.save()
        res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.status(500).send('Server Error')
    }
})

// To unlike a post
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }

        // Check if the post has not yet been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet been liked' })
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1)

        await post.save()
        res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.status(500).send('Server Error')
    }
})

// To create comments
router.post('/comment/:id', auth, [check('text', 'Text is required').not().isEmpty()], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }

        const newComment = {
            user: req.user.id,
            text: req.body.text,
            name: user.name,
            avatar: user.avatar
        }
        post.comments.unshift(newComment)

        await post.save()
        res.json(post.comments)
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.status(500).send('Server Error')
    }

})

// To delete a comment
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: "Post not found" })
        }

        // Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)

        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" })
        }

        // Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" })
        }

        const removeIndex = post.comments.map(comment => comment._id.toString()).indexOf(req.params.comment_id)
        post.comments.splice(removeIndex, 1)
        await post.save()
        res.json(post.comments)
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Not found" })
        }
        res.status(500).send('Server Error')
    }
})

module.exports = router