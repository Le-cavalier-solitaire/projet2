import React from 'react';
import { Link } from 'react-router-dom';

interface User {
    id: number;
    name: string;
    email: string;
    number: string;
}

interface UserListProps {
    users: User[];
    name: string;
}

const UserList: React.FC<UserListProps> = ({ users, name }) => {

    return (
        <>
            <section>
                    <section>
                        <h1>Users List</h1>
                    </section>
                    <section>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                          <p>{user.name}</p>
                                        </td>

                                        <td>
                                            <p>{user.email}</p>
                                        </td>

                                        <td>
                                            <Link to={`/users/${user.id}`}>
                                                <button>
                                                    View full details
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
            </section>
        </>
    );
};

export default UserList;