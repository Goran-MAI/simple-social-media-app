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
    formData.email !== initialData.email || formData.surname !== initialData.surname ||
    formData.name !== initialData.name || formData.username !== initialData.username;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="card" id="userForm" style={{ borderRadius: 8, padding: 16 }}>
      <div className="card-body">
        <h3>{mode === "edit" ? "Edit User Formular" : "Create User Formular"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="surname" className="form-label">Surname</label>
            <input
              id="surname"
              name="surname"
              type="text"
              className="form-control"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              aria-describedby="emailHelp"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={mode === "edit" && !isChanged()}
            >
              {mode === "edit" ? "Save Changes" : "Submit"}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary"
                style={{ marginLeft: 10 }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
    /* <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
      <h2>{mode === "edit" ? "Edit User" : "Create User"}</h2>
      <form onSubmit={handleSubmit}>
        
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
    </div> */
    
  );
}
