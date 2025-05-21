import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import AdminLogin from './components/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AddProduct from './pages/admin/AddProduct'
import Orders from './pages/admin/Orders'
import ProductList from './pages/admin/ProductList'
import Loading from './components/Loading'

const App = () => {
  const isAdminPath=useLocation().pathname.includes('/admin')
  const {showUserLogin, isAdmin}=useAppContext()
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {isAdminPath ? null:<Navbar />}
      {showUserLogin ? <Login /> : null}
      <Toaster/>
      <div className={`${isAdminPath?"":"px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/loader" element={<Loading />} />
          <Route path="/admin" element={isAdmin ? <AdminLayout/> : <AdminLogin/>}>
            <Route index element={isAdmin?<AddProduct/>:null}/>
            <Route path="product-list" element={<ProductList/>}/>
            <Route path="orders" element={<Orders/>}/>
            {/* <Route path="user" element={<User/>}/> */}
            {/* <Route path="setting" element={<Setting/>}/> */}
            {/* <Route path="" element={</>}/> */}
          </Route>
        </Routes>
      </div>
      {!isAdminPath&&<Footer />}
    </div>
  )
}

export default App
