import { useEffect, useState } from "react";

import PostCard from "./PostCard";
import Pagination from "./Pagination";

const URL = import.meta.env.VITE_APP_URL;

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('recent')

    useEffect(() => {
        fetch(URL + `/posts?page=${currentPage}&limit=5&search=${searchQuery}&sort=${sortOption}`)
            .then(response => response.json())
            .then(data => {
                setPosts(data.posts);
                setTotalPages(data.totalPages);
            });
    }, [currentPage, searchQuery, sortOption]);

    function removePost(postId) {
        setPosts(posts.filter(post => post._id !== postId));
    }

    function onSearch(event) {
        event.preventDefault();
        setCurrentPage(1);
    }

    function onSort(event) {
        setSortOption(event.target.value);
        setCurrentPage(1);
    }

    return (
        <>
            <div className="posts-container">

                <div className="sort">
                    <h2>Sort Posts:</h2>

                    <div>

                        <label>
                            <input
                                type="radio"
                                value="recent"
                                checked={sortOption === 'recent'}
                                onChange={onSort}
                            />
                            recent
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="a-z"
                                checked={sortOption === 'a-z'}
                                onChange={onSort}
                            />
                            a-z
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="likes"
                                checked={sortOption === 'likes'}
                                onChange={onSort}
                            />
                            likes
                        </label>

                        <label>

                            <input
                                type="radio"
                                value="z-a"
                                checked={sortOption === 'z-a'}
                                onChange={onSort}
                            />
                            z-a
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="oldest"
                                checked={sortOption === 'oldest'}
                                onChange={onSort}
                            />
                            oldest
                        </label>

                    </div>
                </div>

                <div className="posts">

                    <div className="search">
                        <form onSubmit={onSearch}>
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                            />
                            <button type="submit">Search</button>
                        </form>
                    </div>

                    {posts.length > 0 && posts.map(post => (
                        <PostCard
                            key={post._id} {...post}
                            onRemove={removePost}
                        />
                    ))}

                    {posts.length == 0 && (
                        <div className="latest-no">
                            <div className="pad10">
                                <h2 className="no-posts">No posts yet...</h2>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {posts.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </>
    );
}