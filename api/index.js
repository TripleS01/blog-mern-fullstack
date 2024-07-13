const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');

const uploadMiddware = multer({ dest: 'uploads/' })
const User = require('./models/User');
const Post = require('./models/Post');
const { MONGO_URL, PORT_URL, SECRET_KEY, REACT_URL } = require('./constants-api');

const app = express()
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

const saltRounds = 10;

const isAuth = (request, response, next) => {
    const { token } = request.cookies;

    jwt.verify(token, SECRET_KEY, (error, info) => {
        if (error) return response.status(401).json('Invalid token');

        request.user = info;
        next();
    });
};

app.post('/register', async (request, response) => {
    const { email, username, password, repeatPassword } = request.body;

    if (password !== repeatPassword) {
        return response.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });

        response.json(user);

    } catch (error) {
        response.status(400).json(error);
    }

});

app.post('/login', async (request, response) => {
    const { identifier, password } = request.body;

    const user = await User.findOne({
        $or: [
            { username: identifier },
            { email: identifier },
        ]
    });

    if (!user) {
        return response.status(400).json('Wrong credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
        jwt.sign({ username: user.username, id: user._id }, SECRET_KEY, {}, (error, token) => {
            if (error) return response.status(401).json('Invalid token');

            response.cookie('token', token).json({
                id: user._id,
                username: user.username,
            });

        });
    } else {
        response.status(400).json('Wrong credentials');
    }

});

app.get('/authentication', (request, response) => {
    const { token } = request.cookies;

    jwt.verify(token, SECRET_KEY, {}, (error, info) => {
        if (error) return response.status(401).json('Invalid token');

        response.json(info);
    });

});

app.post('/logout', (request, response) => {
    response.cookie('token', '').json('ok');

});

app.post('/posts', isAuth, uploadMiddware.single('file'), async (request, response) => {
    const { originalname, path } = request.file;
    const spiltOriginalName = originalname.split('.');
    const extension = spiltOriginalName[spiltOriginalName.length - 1];
    const newPath = path + '.' + extension;
    fs.renameSync(path, newPath);

    const { title, summary, description } = request.body;

    const post = await Post.create({
        title,
        summary,
        description,
        image: newPath,
        author: request.user.id,
    });

    await User.findByIdAndUpdate(request.user.id, { $push: { posts: post._id } });

    response.json(post);

});

app.get('/posts', async (request, response) => {
    const { page = 1, limit = 5, search = '', sort = 'recent' } = request.query;

    const searchQuery = search ? { title: { $regex: search, $options: 'i' } } : {};

    let sortQuery = { createdAt: -1 };
    if (sort === 'a-z') {
        sortQuery = { title: 1 };
    } else if (sort === 'z-a') {
        sortQuery = { title: -1 };
    } else if (sort === 'oldest') {
        sortQuery = { createdAt: 1 };
    } else if (sort === 'likes') {
        sortQuery = { 'likes.length': -1 };
    }

    const posts = await Post.find(searchQuery)
        .populate('author', ['username'])
        .sort(sortQuery)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments(searchQuery);

    response.json({
        posts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: parseInt(page)
    });

});


app.get('/posts/:id', async (request, response) => {
    const { id } = request.params;

    const post = await Post.findById(id)
        .populate('author', ['username'])
        .populate('comments.author', ['username']);

    response.json(post);

});


app.put('/posts', isAuth, uploadMiddware.single('file'), async (request, response) => {
    let newPath = null;

    if (request.file) {
        const { originalname, path } = request.file;
        const spiltOriginalName = originalname.split('.');
        const extension = spiltOriginalName[spiltOriginalName.length - 1];
        newPath = path + '.' + extension;
        fs.renameSync(path, newPath);
    }

    const { id, title, summary, description } = request.body;

    const post = await Post.findById(id);
    if (!post) return response.status(404).json('Post not found');

    const isAuthor = JSON.stringify(post.author) === JSON.stringify(request.user.id);
    if (!isAuthor) {
        response.status(400).json('Not an author of this post!')
        throw new Error('Not an author of this post');
    }

    await post.updateOne({
        title,
        summary,
        description,
        image: newPath ? newPath : post.image,
    });

    response.json(post);

});

app.delete('/posts/:id', isAuth, async (request, response) => {
    const { id } = request.params;

    const post = await Post.findById(id);
    if (!post) return response.status(404).json('Post not found');

    const isAuthor = JSON.stringify(post.author) === JSON.stringify(request.user.id);
    if (!isAuthor) {
        response.status(400).json('Not an author of this post!')
        throw new Error('Not an author of this post');
    }

    await post.deleteOne();

    await User.findByIdAndUpdate(request.user.id, { $pull: { posts: id } });

    response.json('Post deleted');

});

app.post('/posts/:id/like', async (request, response) => {
    const { id } = request.params;

    const post = await Post.findById(id);
    if (!post) return response.status(404).json('Post not found');

    const liked = post.likes.includes(request.user.id);
    if (liked) {
        post.likes.pull(request.user.id);
    } else {
        post.likes.push(request.user.id);
    }

    await post.save();

    const update = await Post.findById(id)
        .populate('author', ['username'])
        .populate('comments.author', ['username']);

    response.json(update);

});

app.post('/posts/:id/comment', isAuth, async (request, response) => {
    const { id } = request.params;
    const { content } = request.body;

    const post = await Post.findById(id);
    if (!post) return response.status(404).json('Post not found');

    const comment = {
        author: request.user.id,
        content,
    };

    post.comments.push(comment);
    await post.save();

    const updated = await Post.findById(post._id)
        .populate('author', ['username'])
        .populate('comments.author', ['username']);

    response.json(updated);

});

app.delete('/posts/:id/comment/:commentId', async (request, response) => {
    const { id, commentId } = request.params;

    const post = await Post.findById(id);
    if (!post) return response.status(404).json('Post not found');

    const comment = post.comments.id(commentId);
    if (!comment) return response.status(404).json('Comment not found');

    if (comment.author.toString() !== request.user.id && post.author.toString() !== request.user.id) {
        return response.status(403).json('Unauthorized');
    }

    post.comments.pull(comment);
    await post.save();

    const updated = await Post.findById(id)
        .populate('author', ['username'])
        .populate('comments.author', ['username']);

    response.json(updated);

});

app.post('/posts/:id/comment/:commentId/like', async (request, response) => {
    const { id, commentId } = request.params;

    const post = await Post.findById(id);
    if (!post) return response.status(404).json('Post not found');

    const comment = post.comments.id(commentId);
    if (!comment) return response.status(404).json('Comment not found');

    const alreadyLiked = comment.likes.includes(request.user.id);
    if (alreadyLiked) {
        comment.likes.pull(request.user.id);
    } else {
        comment.likes.push(request.user.id);
    }

    await post.save();

    const updated = await Post.findById(id)
        .populate('author', ['username'])
        .populate('comments.author', ['username']);

    response.json(updated);

});

app.get('/profile', isAuth, async (request, response) => {
    const user = await User.findById(request.user.id).select('-password');

    response.json(user);

});

app.get('/profile/stats', async (request, response) => {
    const posts = await Post.find({ author: request.user.id });
    const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);

    response.json({ totalLikes, totalComments });

});

app.get('/profile/posts', isAuth, async (request, response) => {
    const posts = await Post.find({ author: request.user.id });

    response.json(posts);

});

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log(`money-fullstack is connected to DB`);

        app.listen(PORT_URL, () => console.log(`Server is listening on http://localhost:${PORT_URL}...`));
    })
    .catch(error => console.log('Cannot connect to DB'));