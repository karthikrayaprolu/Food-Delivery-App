import React from 'react'
import './Orders.css'
import {useState} from 'react'
import {toast} from 'react-toastify'
import axios from 'axios'
import { useEffect } from 'react'
import { assets } from '../../../../frontend/src/assets/assets'

const Orders = ({url}) => {


  const [orders,setOrders] = useState([]);

  const fetchAllOrders  = async () => {
    const response = await axios.get(url+"/api/order/list");
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
      
    }
    else{
      toast.error("Error")
    }
  }


  const statusHandler = async (event,orderId) => {
    const response = await axios.post(url+"/api/order/status",{
      orderId:orderId,
      status:event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

  useEffect(()=>{
    fetchAllOrders();
  },[])


  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => {
          return (
            <div className="order-item" key={index}>
              <img src={assets.parcel_icon} alt="" />
              <div className="order-item-details">
                <p className="order-item-food">
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + ",";
                    }
                  })}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street}, {order.address.city}</p>
                  <p>{order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                </div>
              </div>
              <p className="order-item-count">Items: {order.items.length}</p>
              <p className="order-item-price"><b>${order.amount}.00</b></p>
              <select
                className="order-item-status"
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
  
  
}

export default Orders