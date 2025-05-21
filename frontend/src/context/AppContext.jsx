import { createContext, useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { dummyProducts } from '../assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';


axios.defaults.withCredentials=true;
// Set the base URL for axios requests
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
// axios.defaults.baseURL =http://18.233.152.163:5000

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  // Fetch admin status
  const fetchAdminStatus = async () => {
    try {
      const { data } = await axios.get('/api/admin/check-auth');
      if (data.success) {
        setIsAdmin(true);
      }else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error fetching admin status:', error);
    }
  };
  //Fetch user data, user Data and Cart Items
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get('/api/user/check-auth');
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

//Fetch all products
  const fetchProducts = async () => {
    // setProducts(dummyProducts)
    try {
      const { data } = await axios.get('/api/product/list');
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  //Add product to cart
  const addToCart = async (itemId) => {
    let cartData=structuredClone(cartItems)
    if(cartData[itemId]){
      cartData[itemId]+=1
  }
    else{
      cartData[itemId]=1
    }
    setCartItems(cartData)
    toast.success("Item added to cart")
  }
  //update cart Item 
  const updateCartItem = async (itemId, quantity) => {
    let cartData=structuredClone(cartItems)
    cartData[itemId]=quantity
    setCartItems(cartData)
    toast.success("Item updated in cart")
  }
  //Remove product from cart
  const removeFromCart = async (itemId) => {
    let cartData=structuredClone(cartItems)
    if(cartData[itemId]){
      cartData[itemId]-=1
      if(cartData[itemId]===0){
        delete cartData[itemId]
      }
    }
    toast.success("Item removed from cart")
    setCartItems(cartData)
  }
  //Get Cart Item Count
  const getCartCount = () => {
    let totalCount = 0;
    for (const Item in cartItems) {
      totalCount += cartItems[Item];
    }
    return totalCount;
  }
  //Get cart total Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items]>0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount*100)/100;
  }
  //Fetch all products on load
  useEffect(() => {
    fetchUserData();
    fetchAdminStatus();
    fetchProducts();
  }, []);

  //Update cart on load
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post('/api/cart/update', {
          // userId: user._id,
          cartItems: cartItems
        });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    if (user) {
      updateCart();
    }
  }
  , [cartItems]);

  const value = {
    // Add your context values here
    navigate,
    user,
    setUser,
    isAdmin,
    setIsAdmin,
    showUserLogin,
    setShowUserLogin,
    products,
    addToCart,
    updateCartItem,
    currency,
    removeFromCart,
    cartItems,
    setCartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts
  };
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}