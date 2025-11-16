import { useEffect, useState } from 'react'
import './UserList.css'
import { userService } from './services/userService';
import UserFormular from './UserFormular';

function UserList() {

    const [users, setUsers] = useState<any[]>([])

    const loadUsers = () => {
        userService.getUsers()
            .then(fetchedUsers => {
                //console.log('Fetched users:', fetchedUsers);
                setUsers(fetchedUsers); // update state with fetched users
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
        };
    
    useEffect(() => {
        loadUsers();
    }, []); // Empty dependency array means this runs once on mount

    const addUserToList = (newUser: any) => {
        setUsers(prev => [...prev, newUser]);  
    };

  return (
    <div className='d-flex justify-content-between'>
        <UserFormular onUserCreated={addUserToList} />
        <div className="card list-group">
            <h3>User list</h3>
            {users.map((user) => (
                <a href="#" className="list-group-item list-group-item-action" key={user.id}>
                    <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{user.name} {user.surname}</h5>
                    <small>(@{user.username})</small>
                    </div>
                    <p className="mb-1"></p>
                    <small>{user.email}</small>
                </a>
            ))}
        </div>
        <div className="user-list-header">
            <button type="button" className="btn btn-primary add-user-btn" 
            data-bs-placement="right" data-bs-title="Add User" data-bs-toggle="collapse" data-bs-target="#userForm">
                +
            </button>
        </div>
    </div>
  );
}

export default UserList;
