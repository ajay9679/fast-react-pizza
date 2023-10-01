import React from 'react'
import Header from './Header'
import Loader from './Loader'
import CartOverview from '../features/cart/CartOverview'
import { Outlet, useNavigation } from 'react-router-dom'


export default function AppLayout(){
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';

    return <div className='grid grid-rows-[auto_1fr_auto] h-screen ' >
        {isLoading && <Loader />}
        <Header />
        <div className='overflow-auto' >
            <main className='max-w-3xl mx-auto' >
                <Outlet />
            </main>
        </div>
        <CartOverview />
    </div>
}
