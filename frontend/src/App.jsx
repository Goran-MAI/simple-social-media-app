// src/App.jsx
import React, { useState, useEffect } from "react";
import { getAllUsers, updateUser, createUser } from "./api/user";
import { getAllPosts } from "./api/post";
import UserForm from "./components/UserForm";
import PostForm from "./components/PostForm";
import "./App.css"; // neues CSS importieren

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Für Posts
  const [editUser, setEditUser] = useState(null); // Für UserForm
  const [selectedPost, setSelectedPost] = useState(null);
  const [formType, setFormType] = useState(null); // "user" oder "post"

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handleUserSave = async (userData) => {
    try {
      if (editUser) {
        await updateUser(editUser.id, userData);
        alert("User updated successfully!");
      } else {
        await createUser(userData);
        alert("User created successfully!");
      }
      fetchUsers();
      setEditUser(null);
      setFormType(null);
    } catch (err) {
      alert("Error saving user: " + err.message);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Header */}
      <div className="header">
        <img src="/logo.png" alt="Logo" />
        <h1>SSMA - Simple Social Media App</h1>
      </div>

      {/* Main App Container */}
      <div className="app-container">
        {/* Left Column - Users */}
        <div className="column left-column">
          <h2>Users</h2>
          <button
            onClick={() => {
              setEditUser(null);
              setFormType("user");
            }}
          >
            + Add User
          </button>
          <ul className="user-list">
            {users.map((user) => (
              <li key={user.id}>
                <span
                  className={`username ${selectedUser?.id === user.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedUser(user);
                    setEditUser(null); // Edit-Modus schließen
                    setFormType(null); // Form ausblenden
                  }}
                >
                  {user.username}
                </span>
                <span
                  className="user-edit-pencil"
                  title="Edit User"
                  onClick={() => {
                    setEditUser(user);
                    setFormType("user");
                  }}
                  dangerouslySetInnerHTML={{ __html: "&#x1F589;" }}
                ></span>
              </li>
            ))}
          </ul>
        </div>

        {/* Middle Column - Forms */}
        <div className="column">
          {formType === "user" && (
            <UserForm
              mode={editUser ? "edit" : "create"}
              user={editUser}
              onSave={handleUserSave}
            />
          )}

          {formType === "post" && selectedUser && (
            <PostForm
              selectedUser={selectedUser}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
              fetchPosts={fetchPosts}
              setFormType={setFormType}
            />
          )}

          {!formType && <p>Select a User or +Add User/Post</p>}
        </div>

        {/* Right Column - Posts */}
        <div className="column right-column">
          <h2>{selectedUser ? `${selectedUser.username}'s Posts` : "Posts"}</h2>
          {selectedUser && (
            <>
              <button
                onClick={() => {
                  setSelectedPost(null);
                  setFormType("post");
                }}
              >
                + Add Post
              </button>
              <ul className="post-list">
                {posts
                  .filter((p) => p.user_id === selectedUser.id)
                  .map((post) => (
                    <li
                      key={post.id}
                      onClick={() => {
                        setSelectedPost(post);
                        setFormType("post");
                      }}
                    >
                      {post.title}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
