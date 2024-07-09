import { useState } from "react";
import { Navigate } from "react-router-dom";
import PathTo from "../../paths";

const URL = import.meta.env.VITE_APP_URL;

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function onCreatePost(event) {
        event.preventDefault();

        if (!title || !summary || !description || !files) {
            setErrorMessage('All fields are required');
            return;
        }

        const dataForm = new FormData();
        dataForm.set('title', title);
        dataForm.set('summary', summary);
        dataForm.set('description', description);
        dataForm.set('file', files[0]);

        const response = await fetch(URL + '/posts', {
            method: 'POST',
            body: dataForm,
            credentials: 'include',
        });

        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={PathTo.Posts} />;
    }

    return (
        <>
            <div className="container-height">

                <div className="log-reg-create-edit">

                    <form className="create-post" onSubmit={onCreatePost}>
                        <h1>Create Post</h1>
                        <h3>Make a post to share with the others</h3>
                        <img src="/img/create-post.jpg" />
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={event => setTitle(event.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Summary"
                            value={summary}
                            onChange={event => setSummary(event.target.value)}
                        />
                        <textarea
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                        ></textarea>
                        <div className="fileInput">
                            <label >
                                Upload a File:
                            </label>
                            <input
                                type="file"
                                // value={files}
                                onChange={event => setFiles(event.target.files)}
                            />
                        </div>

                        {errorMessage && (
                            <p className="required-message">
                                {errorMessage}
                            </p>
                        )}

                        <button>Create Post</button>

                    </form>
                </div>
            </div>
        </>
    );
}