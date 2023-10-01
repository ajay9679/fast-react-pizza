import { Link } from 'react-router-dom';
import LinkButton from '../../ui/LinkButton';
import Button from '../../ui/Button';
import CartItem from './CartItem'
import EmptyCart from './EmptyCart'
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart } from './cartSlice';


const fakeCart = [
    {pizzaId:12,name:'Mediterranean',quantity:2,unitPrice:16,totalPrice: 32,},
    {pizzaId:6,name:'Vegetale',quantity:1,unitPrice:13,totalPrice:13,},
    {pizzaId:11,name:'Spinach and Mushroom',quantity:1,unitPrice: 15,totalPrice:15,},
];

function Cart(){
    const username = useSelector(state => state.user.username);
    const cart = useSelector(getCart);
    if(!cart.length) return <EmptyCart />
    const dispatch = useDispatch();

    return <div className='px-4 py-3' >
        <LinkButton to="/menu" >&larr; Back to menu</LinkButton>
        <h2 className='mt-7 text-xl font-semibold' >Your cart, {username}</h2>
        <ul className='divide-y divide-stone-300 border-b border-stone-300 mt-3' >
            {cart.map(item => <CartItem item={item} key={item.pizzaId} />)}
        </ul>
        <div className='mt-6 space-x-3' >
            <Button to='/order/new' type='primary' >Order Pizzas</Button>
            {/* <Link to="/order/new">Order pizzas</Link> */}
            <Button onClick={() => dispatch(clearCart())} type='secondary' >Clear cart</Button>
        </div>
    </div>
}

export default Cart;
