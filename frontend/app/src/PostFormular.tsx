import { useState } from "react";
import { postService } from "./services/postService";
import { useUserStore } from './services/userService';

type PostFormularProps = {
    onPostCreated: (newPost: any) => void;
};

function PostFormular({ onPostCreated }: PostFormularProps) {

    const users = useUserStore(state => state.users);

    const [postData, setPostData] = useState({
        title: "",
        comment: "",
        img_path: "",
        user_id: null,
        creation_date: "",
        updated_date: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setPostData(prev => ({...prev,[id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postService.createPost(postData)
            .then(newPost => {
                console.log('Post created:', newPost);
                onPostCreated(newPost);
            })
            .catch(error => {
                console.error('Error creating post:', error);
            });
    };

    return (
        <div className="card collapse" id="postForm">
            <h3>Create Post Formular</h3>
            <form onSubmit={handleSubmit} >
                <div className="mb-3">
                    <label htmlFor="userSelect" className="form-label">Post from user</label>
                    <select className="form-select" id="userSelect" onChange={handleChange}>
                        {users.map((user) => (
                        <option key={user.id} value={`${user.id}`}>{user.name} {user.surname}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" value={postData.title} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Comment</label>
                    <textarea className="form-control" id="comment" value={postData.comment} onChange={handleChange}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#postForm">Submit</button>
            </form>
        </div>
    );
}

export default PostFormular