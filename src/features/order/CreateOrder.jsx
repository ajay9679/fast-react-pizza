import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";


// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(str);

const fakeCart = [
    {pizzaId: 12,name: "Mediterranean",quantity: 2,unitPrice: 16,totalPrice: 32,},
    {pizzaId: 6,name: "Vegetale",quantity: 1,unitPrice: 13,totalPrice: 13,},
    {pizzaId: 11,name: "Spinach and Mushroom",quantity: 1,unitPrice: 15,totalPrice: 15,},
];

function CreateOrder(){
    const [withPriority, setWithPriority] = useState(false);
    const {username,status:addressStatus,position,address,error:errorAddress} = useSelector(state => state.user);
    const isLoadingAddress = addressStatus === 'loading';
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const formErrors = useActionData();
    const isSubmitting = navigation.state === 'submitting';
    const cart = useSelector(getCart);
    const totalCartPrice = useSelector(getTotalCartPrice);
    const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
    const totalPrice = totalCartPrice + priorityPrice;
    console.log(username)

    if(!cart.length) return <EmptyCart />
    
    return <div className="px-4 py-6" >
        <h2 className="mb-8 text-xl font-semibold" >Ready to order? Let's go!</h2>
        <Form method="POST" >
            <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center" >
                <label className="sm:basis-40" >First Name</label>
                <input className="input grow" type="text" name="customer" defaultValue={username} required />
            </div>

            <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
                <label className="sm:basis-40">Phone number</label>
                <div className="grow" >
                    <input className="input w-full" type="tel" name="phone" required />
                    {formErrors?.phone && <p className="text-xs mt-2 text-red-700 bg-red-100 px-3" >{formErrors.phone}</p>}
                </div>
            </div>

            <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center relative">
                <label className="sm:basis-40">Address</label>
                <div className="grow" >
                    <input disabled={isLoadingAddress} defaultValue={address} className="input w-full" type="text" name="address" required />
                    {addressStatus === 'error' && <p className="text-xs mt-2 text-red-700 bg-red-100 px-3" >{errorAddress}</p>}
                </div>
                {!position?.latitude && !position?.longitude && <span disabled={isLoadingAddress} className="absolute right-[3px] top-[34px] z-50 md:right-[3px] md:top-0" ><Button type='small' onClick={(e) => {
                    e.preventDefault();
                    dispatch(fetchAddress())
                }} >Get Position</Button></span>}
            </div>
            
            <div className="mb-12 flex gap-5 items-center">
                <input className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2" type="checkbox" name="priority" id="priority" value={withPriority} onChange={(e) => setWithPriority(e.target.checked)} />
                <label className="font-medium" htmlFor="priority">Want to yo give your order priority?</label>
            </div>

            <div>
                <input type="hidden" name="cart" value={JSON.stringify(cart)} />
                <input type="hidden" name="position" value={position.longitude && position.latitude ? `${position.latitude},${position.longitude}` : ''} />
                <Button disabled={isSubmitting || isLoadingAddress} type='primary' >{isSubmitting ? 'Ordering...' : `Order now from ${formatCurrency(totalPrice)}`}</Button>
            </div>
        </Form>
    </div>
}

export async function action({request}){
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const order = {...data,cart:JSON.parse(data.cart),priority:data.priority === 'true'};
    const errors = {};
    if(!isValidPhone(order.phone))
        errors.phone = 'Please enter valid phone number.';
    if(Object.keys(errors).length > 0) return errors;
    const newOrder = await createOrder(order);
    return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;