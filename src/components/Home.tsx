import UserList from './UserList';
import useFetch from '../useFetch';

const Home = (): JSX.Element => {
    const { data: users, isPending, error } = useFetch('http://localhost:8000/users')

    return (
        <section>
            {error && <p>{error}</p>}
            {isPending && <p>Loading users...</p>}
            {users && <UserList users={users} name={''} />}
        </section>
    );
};

export default Home;