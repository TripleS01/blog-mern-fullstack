import { useState, useEffect } from "react";
import HomePost from "./HomePost";

export default function Home() {
    const [latestPosts, setLatestPosts] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetch(`http://localhost:5757/posts?limit=3&page=${page}`)
            .then(response => response.json())
            .then(data => setLatestPosts(data.posts));
    }, [page]);

    return (
        <>
            <div className="home container-height">

                <div className="main">
                    <img src="/img/home.jpg" alt="IMG" />
                    <div className="pad10 main-info">
                        <h1>Main</h1>
                        <p>Content Here...</p>
                    </div>
                </div>

                {latestPosts.length > 0 && (
                    <div className="latest-three">
                        {latestPosts.map(post => (
                            <HomePost
                                key={post._id}
                                {...post}
                            />

                        ))}
                    </div>
                )}

                {latestPosts.length == 0 && (
                    <div className="latest-no">
                        <div className="pad10">
                            <h2 className="no-posts">No posts yet...</h2>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}