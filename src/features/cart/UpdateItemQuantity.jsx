import React from 'react'
import Button from '../../ui/Button'
import { decreaseQuantity, increaseQuantity } from './cartSlice'
import { useDispatch } from 'react-redux'


export default function UpdateItemQuantity({pizzaId,currentQuantity}){
    const dispatch = useDispatch();

    return <div className='flex gap-1 items-center md:gap-3' >
        <Button type='round' onClick={() => dispatch(decreaseQuantity(pizzaId))} >-</Button>
        <span className='text-sm font-medium' >{currentQuantity}</span>
        <Button type='round' onClick={() => dispatch(increaseQuantity(pizzaId))} >+</Button>
    </div>
}
