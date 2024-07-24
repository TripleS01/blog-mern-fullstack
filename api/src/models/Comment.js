// const mongoose = require('mongoose');

// const CommentSchema = new mongoose.Schema({
//     author: {
//         type: mongoose.Types.ObjectId,
//         ref: 'User',
//     },
//     content: {
//         type: String,
//         required: true,
//     },
//     likes: [{
//         type: mongoose.Types.ObjectId,
//         ref: 'User',
//     }],
// }, {
//     timestamps: true
// });

// const CommentModel = mongoose.model('Comment', CommentSchema);
// module.exports = CommentModel;