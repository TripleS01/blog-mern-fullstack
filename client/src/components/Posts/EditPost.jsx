import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import PathTo from "../../paths";


export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5757' + `/posts/${id}`)
            .then(response => response.json())
            .then(dataPost => {
                setTitle(dataPost.title);
                setSummary(dataPost.summary);
                setDescription(dataPost.description);
            })
            .catch(error => console.error('Error fetching post:', error));

    }, [id]);

    async function onEditPost(event) {
        event.preventDefault();

        if (!title || !summary || !description) {
            setErrorMessage('All fields are required');
            return;
        }

        const dataForm = new FormData();
        dataForm.set('title', title);
        dataForm.set('summary', summary);
        dataForm.set('description', description);
        dataForm.set('id', id);
        if (files?.[0]) {
            dataForm.set('file', files?.[0]);
        }

        const response = await fetch('http://localhost:5757/posts', {
            method: 'PUT',
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

                    <form className="create-post" onSubmit={onEditPost}>
                        <h1>Edit Post</h1>
                        <h3>Something went wrong? Time to fix it!</h3>
                        <img src="/img/edit-post.jpg" />
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

                        <button>Edit Post</button>

                    </form>
                </div>
            </div>
        </>
    );
}