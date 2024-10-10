import React, { useContext, useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';
import { StoreContext } from '../../context/StoreContext';

const Home = () => {
  const [category, setCategory] = useState("All");
  const { food_list } = useContext(StoreContext); // Access food_list from context

  // Filter food items based on the selected category
  const filteredFoodItems = category === "All"
    ? food_list
    : food_list.filter(item => item.category === category);

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} foodItems={filteredFoodItems} /> {/* Pass filtered food items */}
      <AppDownload />
    </div>
  );
};

export default Home;
