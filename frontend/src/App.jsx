// src/App.jsx
import React, { useState, useEffect } from "react";
import { getAllUsers, updateUser, createUser, deleteUser } from "./api/user";
import { getAllPosts, deletePost } from "./api/post";
import UserForm from "./components/UserForm";
import PostForm from "./components/PostForm";
import "./App.css"; // neues CSS importieren
import Logo from "./assets/SSMA_Logo.svg"; // Pfad relativ zur JSX-Datei

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Für Posts
  const [editUser, setEditUser] = useState(null); // Für UserForm
  const [selectedPost, setSelectedPost] = useState(null);
  const [formType, setFormType] = useState(null); // "user" oder "post"

  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

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

  const handleUserDelete = async (userData) => {
    try {
      if (confirm("Are you sure you want to delete this user?") == true) {
        await deleteUser(userData.id);
        alert("User deleted successfully!");
        setEditUser(null);
        setFormType(null);
        fetchUsers();
      }
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  const handlePostDelete = async (postData) => {
    try {
      if (confirm("Are you sure you want to delete this post?") == true) {
        await deletePost(postData.id);
        alert("Post deleted successfully!");
        setSelectedPost(null);
        setFormType(null);
        fetchPosts();
      }
    } catch (err) {
      alert("Error deleting post: " + err.message);
    }
  };

    const filteredPosts = posts.filter((p) => {
      const matchesUser = selectedUser ? p.user_id === selectedUser.id : true;
      const matchesSearch = appliedSearch
        ? p.title?.toLowerCase().includes(appliedSearch.toLowerCase())
        : true;
      return matchesUser && matchesSearch;
    });

    const handleSearchSubmit = (e) => {
      e.preventDefault();
      setAppliedSearch(searchTerm.trim());
    };


  return (
    <div className="app-wrapper">
      {/* Header */}
      <div className="header">
        <img src={Logo} alt="Logo" />
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
                {/*<span
                  className="user-delete-trashcan"
                  title="Delete User"
                  onClick={(e) => {
                    handleUserDelete(user);
                  }}
                  dangerouslySetInnerHTML={{ __html: "&#x1F5D1;" }}
                ></span>*/}
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

          {formType === "post" /*&& selectedUser*/ && (
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
          {selectedUser ? (
            <>
              <nav className="navbar">
                <div className="container-fluid">
                  <button
                    onClick={() => {
                      setSelectedPost(null);
                      setFormType("post");
                    }}
                  >
                    + Add Post
                  </button>
                  <form className="d-flex" onSubmit={handleSearchSubmit}>
                    <input className="form-control me-2 mt-1" type="search" placeholder="Search Title" aria-label="Search"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    <button className="btn btn-outline-info" type="submit">Search</button>
                  </form>
                </div>
              </nav>
              <ul className="post-list">
                {filteredPosts.map((post) => (
                    <li key={post.id}>
                     <span
                      className={`post ${selectedPost?.id === post.id ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedPost(post);
                        setFormType("post");
                      }}
                    >
                      {post.title}
                      </span>
                      <span
                        className="post-delete-trashcan"
                        title="Delete Post"
                        onClick={() => {
                          handlePostDelete(post);
                        }}
                        dangerouslySetInnerHTML={{ __html: "&#x1F5D1;" }}
                      ></span>
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <ul className="post-list">
                {posts
                  .map((post) => (
                    <li key={post.id}>
                      <span
                      onClick={() => {
                        setSelectedPost(post);
                        setFormType("post");
                      }}
                    >
                      {post.title}
                      </span>
                      <span
                        className="post-delete-trashcan"
                        title="Delete Post"
                        onClick={() => {
                          handlePostDelete(post);
                        }}
                        dangerouslySetInnerHTML={{ __html: "&#x1F5D1;" }}
                      ></span>
                    </li>
                  ))}
              </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
