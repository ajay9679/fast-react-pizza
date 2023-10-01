import { useSelector } from 'react-redux';
import CreatUser from '../features/user/CreateUser'
import Button from './Button';


function Home(){
    const username = useSelector(state => state.user.username);

    return <div className='my-10 px-4 sm:my-16 text-center' >
        <h1 className="text-xl font-semibold mb-8 md:text-3xl" >
            The best pizza.
            <br />
            <span className="text-yellow-500" >Straight out of the oven, straight to you.</span>
        </h1>
        {username === '' ? <CreatUser /> : <Button type='primary' to='/menu' >Continue ordering...</Button>}
    </div>
}

export default Home;
