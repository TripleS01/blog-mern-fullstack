import { format } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { UserContext } from '../../contexts/UserContext';
import PathTo from '../../paths';

const URL = import.meta.env.VITE_APP_URL;

export default function PostPage() {
    const [post, setPost] = useState(null);
    const [content, setComment] = useState('');
    const { id } = useParams();
    const { userInfo } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5757' + `/posts/${id}`)
            .then(response => response.json())
            .then(dataPost => setPost(dataPost))

    }, [id]);

    if (!post) {
        return <div className="loading">Loading...</div>;
    }

    async function onDeletePost() {
        const response = await fetch(URL + `/posts/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            navigate(PathTo.Posts);
        }
    }

    async function onLikePost() {
        const response = await fetch(URL + `/posts/${id}/like`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            const update = await response.json();
            setPost(update);
        }
    }

    async function onCommentPost(event) {
        event.preventDefault();

        const response = await fetch(URL + `/posts/${id}/comment`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ content: content }),
        });

        if (response.ok) {
            const update = await response.json();
            setPost(update);
            setComment('')
        }
    }

    async function onCommentDelete(commentId) {
        const response = await fetch(URL + `/posts/${id}/comment/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            const update = await response.json();
            setPost(update);
        }
    }

    async function onCommentLike(commentId) {
        const response = await fetch(URL + `/posts/${id}/comment/${commentId}/like`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            const update = await response.json();
            setPost(update);
        }
    }

    const user = userInfo?.username;

    return (
        <>
            <div className="post-page">

                <div className="post-page-image">
                    <img src={'http://localhost:5757' + `/${post.image}`} alt={post.title} />
                </div>

                <div className="post-page-btns">

                    {userInfo && userInfo.id === post.author._id && (
                        <>
                            <Link className="pp-btn pp-edit" to={PathTo.EditPost + `/${post._id}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                Edit post
                            </Link>

                            <Link className="pp-btn pp-delete" onClick={onDeletePost}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Delete post
                            </Link>
                        </>
                    )}

                    {userInfo && (
                        <>
                            <Link className="pp-btn pp-more" onClick={onLikePost}>
                                <svg fill={post.likes.includes(userInfo.id) ? "#CC313D" : "none"}
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                                {post.likes.length}
                            </Link>

                            <Link className="pp-btn pp-more" >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                </svg>
                                {post.comments.length}
                            </Link>
                        </>
                    )}

                </div>

                <div className="pp-wrap">

                    <h1>{post.title}</h1>

                    <div className="created-by">
                        <div className="created-by-author">
                            <span className="post-page-author">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                                </svg>
                                {post.author.username}
                            </span>
                        </div>
                        <div className="created-by-time">
                            <time className="post-page-time"> {format(new Date(post.createdAt), 'MMM d, yyyy HH:mm')}
                            </time>
                        </div>
                    </div>

                    <div className="post-page-summary">
                        <h4>{post.summary}</h4>
                    </div>

                    <div className="post-page-description">
                        <p>{post.description}</p>
                    </div>
                </div>

                <div className="comments">
                    <h3>Comments:</h3>

                    {post.comments.map((comment) => (
                        <div key={comment._id} className="comment">

                            <div className="cm-user">

                                <div className="cm-author">
                                    <h4>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                                        </svg>
                                        {comment.author.username}
                                    </h4>

                                    <time className="created-at">
                                        {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                                    </time>
                                </div>

                                {userInfo && (
                                    <>
                                        <Link className="pp-comment pp-like" onClick={() => onCommentLike(comment._id)}>
                                            <svg fill={comment.likes.includes(userInfo.id) ? "#CC313D" : "none"}
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                            </svg>
                                            {comment.likes.length}
                                        </Link>
                                    </>
                                )}

                                {/* {userInfo && userInfo.id === comment.author._id && (
                                    <>
                                        <Link className="pp-comment pp-edit" onClick={() => onCommentEdit(comment._id, comment.content)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </Link>
                                    </>
                                )} */}

                                {userInfo && (userInfo.id === comment.author._id || userInfo.id === post.author._id) && (
                                    <>
                                        <Link
                                            className="pp-comment pp-delete"
                                            onClick={() => onCommentDelete(comment._id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </Link>
                                    </>
                                )}
                            </div>


                            <p className="cm-content">
                                {comment.content}
                            </p>
                        </div>
                    ))}

                    {user && (
                        <>
                            <div className="add-cm">
                                <textarea
                                    value={content}
                                    onChange={(event) => setComment(event.target.value)}
                                    placeholder="Add a comment..."
                                />
                                <button onClick={onCommentPost}>Add Comment</button>
                            </div>
                        </>
                    )}
                </div>

            </div >
        </>
    );
}