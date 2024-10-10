import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore our menu</h1>
        <p className='explore-menu-text'>Explore our diverse menu and discover a world of flavors at your fingertips! From savory starters to mouth-watering main courses and delectable desserts, there's something for everyone. Whether you're in the mood for comfort food, healthy options, or international cuisine, our menu offers a variety of choices to satisfy every craving. Filter by cuisine, restaurant, or dietary preferences and find the perfect dish for any occasion. Dive into our menu and start your culinary journey today!</p>
        <div className='explore-menu-list'>
            {menu_list.map((item, index) => {
                return (
                    <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className='explore-menu-list-item'>
                        <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                        <p>{item.menu_name}</p>
                    </div>
                )
            })}
        </div>
        <hr />
    </div>
  )
}

export default ExploreMenu