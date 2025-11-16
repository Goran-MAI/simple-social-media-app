import React from "react";

export default function UserList({ users, selectedUser, setSelectedUser, setFormType }) {
  return (
    <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "10px" }}>
      <h2>Users</h2>
      <button
        onClick={() => {
          setFormType("user");
        }}
      >
        + Add User
      </button>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => setSelectedUser(user)}
            style={{
              cursor: "pointer",
              fontWeight: selectedUser?.id === user.id ? "bold" : "normal",
            }}
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
