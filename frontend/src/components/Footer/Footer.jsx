import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" />
                <p>Copyright 2022. All rights reserved.</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <a href="https://www.linkedin.com/in/karthikrayaprolu?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app "><img  src={assets.linkedin_icon} alt="" /></a>
                    
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>Get in Touch</h2>
                <ul>
                    <li>+91 9618830864</li>
                    <li>abhiruchulu@gmail.com</li>
                </ul>

            </div>
        </div>
        <hr />
        <p className="footer-copyright">
            &copy; 2022 Abhiruchulu. All rights reserved.
        </p>

    </div>
  )
}

export default Footer