import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const {isAdmin, setIsAdmin, navigate,axios} = useAppContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [error, setError] = useState('')

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      const {data} = await axios.post('/api/admin/login', {
        email,
        password
      })
      if (data.success) {
        setIsAdmin(true)
        navigate('/admin')
      }else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message) 
    }
  }

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin')
    }
  }, [isAdmin])

  return !isAdmin && (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600 bg-black/20'>
      <div className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
        <p className="text-2xl font-medium m-auto">
          Admin Login
        </p>
        <div className="w-full ">
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
        </div>
        <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
          Login
        </button>
      </div>
      
    </form>
  )
}

export default AdminLogin
