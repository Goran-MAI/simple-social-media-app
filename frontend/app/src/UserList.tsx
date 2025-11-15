import { useEffect, useState } from 'react'
import './UserList.css'
import { userService } from './services/userService';

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

    const handleAddUser = () => {
        // TODO: open Modal/Form to add user
        console.log('Add user clicked');
    };

  return (

    <>
    <div className='container'>
        <div className="list-group">
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
            <button type="button" onClick={handleAddUser} className="btn btn-primary add-user-btn" 
            data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Add User" >
                +
            </button>
        </div>
    </div>
    
    </>
  );
}

export default UserList;
