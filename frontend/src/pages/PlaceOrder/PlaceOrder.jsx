import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js'; // Import Stripe's JS library
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isCartEmpty = () => {
    return food_list.every((item) => cartItems[item._id] === 0);
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (isCartEmpty()) {
      console.error("Cart is empty. Please add items to your cart before proceeding.");
      return;
    }

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    // Construct address object
    const address = {
      firstName: data.firstName,
      lastName: data.lastName,
      street: data.street,
      city: data.city,
      state: data.state,
      zipcode: data.zipcode,
      country: data.country,
    };

    // Ensure address is properly logged
    console.log("Address being sent:", address);

    const orderData = {
      customer: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      },
      address: data, // Pass address object
      items: orderItems,
      totalAmount: getTotalCartAmount() + (getTotalCartAmount() > 0 ? 2 : 0),
      userId: localStorage.getItem("userId"),
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      console.log("Order response:", response.data); // Log the response data

      if (response.data.success) {
        const stripe = await loadStripe('pk_test_51Q7HC2Ru2lPW20DiVpJ8vHSOZFFfsLhMq9mfgFxTP48KSNuDmerey0aAtrSaBy2mAUlUtaOfVj9th24C0P39NP07008UyRdMzD'); // Replace with your Stripe publishable key
        // Redirect to the Stripe Checkout page
        const { sessionId } = response.data; // Make sure your server returns the sessionId
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error("Error redirecting to Checkout:", error);
        }
      } else {
        console.error("Failed to place order:", response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
    }
  };

  const totalAmount = getTotalCartAmount();

  const navigate = useNavigate();


  useEffect(()=>{
    if (!token) {
      navigate('/cart')
    }
    else if(getTotalCartAmount===0){
      navigate('/cart')
    }
  },[token])

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
        </div>
        <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
        <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
        <div className="multi-fields">
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip Code" />
          <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${totalAmount}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${totalAmount > 0 ? 2 : 0}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <b>${totalAmount > 0 ? totalAmount + 2 : 0}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;