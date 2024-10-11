import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Navbar from './components/Navbar/Navbar';
import StoreContextProvider from './context/StoreContext';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <StoreContextProvider>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : null}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>
      </div>
      <Footer />
    </StoreContextProvider>
  );
};

export default App;