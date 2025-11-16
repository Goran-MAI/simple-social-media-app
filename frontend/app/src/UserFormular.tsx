import { useState } from "react";
import { userService } from "./services/userService";

type UserFormularProps = {
    onUserCreated: (newUser: any) => void;
};

function UserFormular({ onUserCreated }: UserFormularProps) {

    const [userData, setUserData] = useState({
        name: "",
        surname: "",
        username: "",
        email: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setUserData(prev => ({...prev,[id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        userService.createUser(userData)
            .then(newUser => {
                console.log('User created:', newUser);
                onUserCreated(newUser);
            })
            .catch(error => {
                console.error('Error creating user:', error);
            });
    };

    return (
        <div className="card collapse" id="userForm">
            <h3>Create User Formular</h3>
            <form onSubmit={handleSubmit} >
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" value={userData.name} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="surname" className="form-label">Surname</label>
                    <input type="text" className="form-control" id="surname" value={userData.surname} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" value={userData.username} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" value={userData.email} onChange={handleChange}/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <button type="submit" className="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#userForm">Submit</button>
            </form>
        </div>
    );
}

export default UserFormular