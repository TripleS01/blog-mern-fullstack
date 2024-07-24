const express = require('express');
const multer = require('multer');

const {
    register,
    login,
    authentication,
    logout
} = require('./src/controllers/authController');

const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    addComment,
    deleteComment,
    likeComment
} = require('./src/controllers/postController');

const {
    getProfile,
    updateProfile,
    getProfileStats,
    getProfilePosts

} = require('./src/controllers/profileController');

const isAuth = require('./src/middlewares/isAuth');

const router = express.Router();
const uploadMiddleware = multer({ dest: './uploads/' });

router.post('/register', register);
router.post('/login', login);
router.get('/authentication', authentication);
router.post('/logout', logout);

router.post('/posts', isAuth, uploadMiddleware.single('file'), createPost);
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.put('/posts', isAuth, uploadMiddleware.single('file'), updatePost);
router.delete('/posts/:id', isAuth, deletePost);
router.post('/posts/:id/like', isAuth, likePost);
router.post('/posts/:id/comment', isAuth, addComment);
router.delete('/posts/:id/comment/:commentId', isAuth, deleteComment);
router.post('/posts/:id/comment/:commentId/like', isAuth, likeComment);

router.get('/profile', isAuth, getProfile);
router.post('/profile/update', isAuth, updateProfile);
router.get('/profile/stats', isAuth, getProfileStats);
router.get('/profile/posts', isAuth, getProfilePosts);

module.exports = router;