import React, { useEffect, useState } from "react";
import { getAllPosts } from "./api/post";
import { getAllUsers } from "./api/user";

function App() {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllPosts().then(setPosts).catch(console.error);
        getAllUsers().then(setUsers).catch(console.error);
    }, []);

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map(u => <li key={u.id}>{u.username}</li>)}
            </ul>

            <h1>Posts</h1>
            <ul>
                {posts.map(p => <li key={p.id}>{p.title}</li>)}
            </ul>
        </div>
    );
}

export default App;
