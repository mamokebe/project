import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Loading = () => {

   const {navigate} = useAppContext()
   let {search}= useLocation()
   const query = new URLSearchParams(search)
   const nextUrl = query.get('next')
  //  setCartItems({})

   useEffect(() => {
    if(nextUrl){
      setTimeout(() => {
        navigate(`/${nextUrl}`)
        // setCartItems({})
      }, 5000)
    }
   },[nextUrl])
  return (
    <div className='flex items-center justify-center h-screen flex-col'>
        <svg className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent" viewBox="0 0 24 24"></svg>
        <p className='text-gray-500 mt-4'>Loading...</p>
        <p className='text-gray-500'>Please wait</p>
      
    </div>
  )
}

export default Loading
