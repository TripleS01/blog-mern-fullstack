const fs = require('fs');
const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (request, response) => {
    const { originalname, path } = request.file;
    const splitOriginalName = originalname.split('.');
    const extension = splitOriginalName[splitOriginalName.length - 1];
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

};

exports.getPosts = async (request, response) => {
    const { page = 1, limit = 5, search = '', sort = 'recent' } = request.query;

    const searchQuery = search ? { title: { $regex: search, $options: 'i' } } : {};

    let sortQuery = { createdAt: -1 };
    if (sort === 'a-z') {
        sortQuery = { title: 1 };
    } else if (sort === 'oldest') {
        sortQuery = { createdAt: 1 };
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

};

exports.getPostById = async (request, response) => {
    const { id } = request.params;

    const post = await Post.findById(id)
        .populate('author', ['username'])
        .populate('comments.author', ['username']);

    response.json(post);

};

exports.updatePost = async (request, response) => {
    let newPath = null;

    if (request.file) {
        const { originalname, path } = request.file;
        const splitOriginalName = originalname.split('.');
        const extension = splitOriginalName[splitOriginalName.length - 1];
        newPath = path + '.' + extension;
        fs.renameSync(path, newPath);
    }

    const { id, title, summary, description } = request.body;

    const post = await Post.findById(id);
    if (!post) return response.status(404).json('Post not found');

    const isAuthor = JSON.stringify(post.author) === JSON.stringify(request.user.id);
    if (!isAuthor) {
        response.status(400).json('Not an author of this post!');
        throw new Error('Not an author of this post');
    }

    await post.updateOne({
        title,
        summary,
        description,
        image: newPath ? newPath : post.image,
    });

    response.json(post);

};

exports.deletePost = async (request, response) => {
    const { id } = request.params;

    const post = await Post.findById(id);
    if (!post) return response.status(404).json('Post not found');

    const isAuthor = JSON.stringify(post.author) === JSON.stringify(request.user.id);
    if (!isAuthor) {
        response.status(400).json('Not an author of this post!');
        throw new Error('Not an author of this post');
    }

    await post.deleteOne();

    await User.findByIdAndUpdate(request.user.id, { $pull: { posts: id } });

    response.json('Post deleted');

};

exports.likePost = async (request, response) => {
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

    const updated = await Post.findById(id)
        .populate('author', ['username'])
        .populate('comments.author', ['username']);

    response.json(updated);

};

exports.addComment = async (request, response) => {
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

};

exports.deleteComment = async (request, response) => {
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

};

exports.likeComment = async (request, response) => {
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

};