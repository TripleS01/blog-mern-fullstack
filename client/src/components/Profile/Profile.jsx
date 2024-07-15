import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { format } from 'date-fns';

import PathTo from '../../paths';
import { UserContext } from '../../contexts/UserContext';

const URL = import.meta.env.VITE_APP_URL;

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ totalLikes: 0, totalComments: 0 });
    const [posts, setPosts] = useState([]);
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        fetch(URL + '/profile', {
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => { setProfile(data) })

        // Fetch user stats
        fetch(URL + '/profile/stats', {
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => { setStats(data) })

        // Fetch user's posts
        fetch(URL + '/profile/posts', {
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => { setPosts(data) })
    }, []);

    if (!profile) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <>
            <div className="profile-container container-height">

                <div className="profile-page">
                    <div className="profile">
                        <div className="info">
                            <Link className="profile-edit-btn pc-edit">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </Link>
                            <img src="/img/profile.jpg" alt="Profile" />

                            <h1>{profile.username}</h1>
                            <p className="profile-name">{profile.name || 'N/A'}</p>
                            <div className="profile-line info-2">
                                <span>Sex:</span>
                                <p>{profile.sex || 'N/A'}</p>
                                <span>Born:</span>
                                <p>{profile.birthDate || 'N/A'}</p>
                                <span>Email:</span>
                                <p>{profile.email}</p>
                            </div>
                        </div>
                        <div className="profile-line more-info">
                            <span>From: </span>
                            <p>{profile.location || 'N/A'}</p>
                            <span>Created:</span>
                            <time>{format(new Date(profile.createdAt), 'MMM d, yyyy HH:mm')}</time>
                        </div>
                    </div>

                    <div className="profile-stats">

                        <div className="statistics">
                            <h1>Profile Stats:</h1>
                            <div className="statistics-numbers">
                                <ul>
                                    <li className="red-dot">Likes: {stats.totalLikes}</li>
                                    {/* <li className="green-dot">Liked: 3515</li> */}
                                </ul>
                                <ul>
                                    <li className="blue-dot">Comments: {stats.totalComments}</li>
                                    {/* <li className="orange-dot">Commented: 124</li> */}
                                </ul>
                            </div>
                        </div>

                        <div className="profile-posts">
                            <h1>Posts:</h1>

                            <div className="profile-post-table">
                                <time>Date:</time>
                                <p>Title:</p>
                            </div>

                            {posts.map(post => (

                                <div key={post._id} className="profile-post">
                                    <time>{format(new Date(post.createdAt), 'MMM d, yyyy')}</time>
                                    <Link to={PathTo.Posts + `/${post._id}`} className="profile-post-title">
                                        <p>{post.title}</p>
                                    </Link>
                                    <div to={PathTo.EditPost + `/${post._id}`} className="profile-btns">
                                        <Link className="profile-btn pc-edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </Link>
                                        <Link to={PathTo.Posts + `/${post._id}`} className="profile-btn pc-delete">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </Link>

                                        {userInfo && (
                                            <>
                                                <Link className="profile-btn more">
                                                    <svg fill={post.likes.includes(userInfo.id) ? "#CC313D" : "none"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                    </svg>
                                                    {post.likes.length}
                                                </Link>
                                            </>
                                        )}

                                        <Link className="profile-btn more">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                            </svg>
                                            {post.comments.length}
                                        </Link>
                                        <Link to={PathTo.Posts + `/${post._id}`} className="profile-btn more">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        </Link>

                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}