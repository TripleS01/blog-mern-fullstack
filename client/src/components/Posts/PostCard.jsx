import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns'

import PathTo from '../../paths';
import { UserContext } from '../../contexts/UserContext';

const URL = import.meta.env.VITE_APP_URL;

export default function PostCard({
    _id,
    title,
    summary,
    image,
    createdAt,
    author,
    onRemove,
    likes,
    comments,
}) {
    const { userInfo } = useContext(UserContext);

    async function onDeletePost() {
        const response = await fetch(URL + `/posts/${_id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            onRemove(_id);
        }

    };

    return (
        <>
            <div className="post">

                <div className="post-img">

                    <Link to={PathTo.Posts + `/${_id}`}>
                        <img src={'http://localhost:5757' + `/${image}`} alt="" />
                    </Link>

                </div>

                <div className="pad10">
                    <div className="post-text">

                        <Link to={PathTo.Posts + `/${_id}`}>
                            <h2>{title}</h2>
                        </Link>

                        <p className="post-info">
                            <a className="post-author">{author.username}</a>
                            <time>{format(new Date(createdAt), 'MMM d, yyy HH:mm')}</time>
                        </p>
                        <p className="post-summary">{summary}</p>

                        <div className="post-card-btns">

                            {userInfo && userInfo.id === author._id && (
                                <>
                                    <Link className="pc-btn pc-edit" to={PathTo.EditPost + `/${_id}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                        Edit post
                                    </Link>

                                    <Link className="pc-btn pc-delete" onClick={onDeletePost}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        Delete post
                                    </Link>
                                </>
                            )}

                            {userInfo && (
                                <>
                                    <Link className="pc-btn more" to={PathTo.Posts + `/${_id}`}>
                                        <svg fill={likes.includes(userInfo.id) ? "#CC313D" : "none"}
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                        {likes.length}
                                    </Link>
                                </>
                            )}

                            <Link className="pc-btn more" to={PathTo.Posts + `/${_id}`} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                </svg>
                                {comments.length}
                            </Link>


                            <Link className="pc-btn more" to={PathTo.Posts + `/${_id}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                More details...
                            </Link>

                        </div>

                    </div>
                </div>
            </div>
        </>

    );
}