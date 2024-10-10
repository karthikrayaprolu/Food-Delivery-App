import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name = "Unknown", description = "No description available", image = "default.jpg", price = 0 }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext); // Ensure `url` is coming from context

  console.log("FoodItem cartItems:", cartItems); // Debugging log

  // Check if cartItems is defined
  if (!cartItems) {
    console.error("cartItems is undefined");
    return null;
  }

  const handleImageError = (e) => {
    e.target.src = assets.fallback_image; // Use the correct fallback image path
  };

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img 
          className='food-item-image' 
          src={`${url}/images/${image}`} // Ensure the image URL is correct
          alt={name} 
          onError={handleImageError} 
        />
        {!cartItems[id] ? (
          <img 
            className='add' 
            onClick={() => addToCart(id)} 
            src={assets.add_icon_white} 
            alt="Add" 
            onError={handleImageError} 
          />
        ) : (
          <div className='food-item-counter'>
            <img 
              onClick={() => removeFromCart(id)} 
              src={assets.remove_icon_red} 
              alt="Remove" 
              onError={handleImageError} 
            />
            <p>{cartItems[id]}</p>
            <img 
              onClick={() => addToCart(id)} 
              src={assets.add_icon_green} 
              alt="Add" 
              onError={handleImageError} 
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" onError={handleImageError} />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
