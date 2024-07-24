const User = require('../models/User');
const Post = require('../models/Post');

exports.getProfile = async (request, response) => {
    const user = await User.findById(request.user.id).select('-password');
    response.json(user);

};

exports.updateProfile = async (req, res) => {
    const { name, sex, birthDate, location } = req.body;
    const updateFields = { name, sex, birthDate, location };

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateFields },
        { new: true, runValidators: true }
    ).select('-password');
    res.json(user);

};

exports.getProfileStats = async (request, response) => {
    const posts = await Post.find({ author: request.user.id });
    const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);

    response.json({ totalLikes, totalComments });

};

exports.getProfilePosts = async (request, response) => {
    const posts = await Post.find({ author: request.user.id });
    response.json(posts);

};
