// src/components/UserForm.jsx
import React, { useState, useEffect } from "react";

export default function UserForm({ mode, user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    surname: "",
  });

  const [initialData, setInitialData] = useState(formData);

  useEffect(() => {
    if (user) {
      const initial = {
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        surname: user.surname || "",
      };
      setFormData(initial);
      setInitialData(initial);
    } else {
      const initial = { username: "", name: "", email: "", surname: "" };
      setFormData(initial);
      setInitialData(initial);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Prüft, ob sich etwas geändert hat (nur für Edit)
  const isChanged = () =>
    formData.email !== initialData.email || formData.surname !== initialData.surname;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
      <h2>{mode === "edit" ? "Edit User" : "Create User"}</h2>
      <form onSubmit={handleSubmit}>
        {/* Username und Name */}
        {mode === "edit" ? (
          <>
            <div>
              <label>Username:</label>
              <input type="text" value={formData.username} readOnly />
            </div>
            <div>
              <label>First Name:</label>
              <input type="text" value={formData.name} readOnly />
            </div>
          </>
        ) : (
          <>
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {/* Editable fields */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Surname:</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <button type="submit" disabled={mode === "edit" && !isChanged()}>
            {mode === "edit" ? "Save Changes" : "Create User"}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
