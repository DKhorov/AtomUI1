import React from 'react';
import img1 from '../../img/cs2.gif';
import { FaReact, FaShoppingCart, FaUser } from 'react-icons/fa';
import { GiCoffeeCup, GiShoppingBag } from 'react-icons/gi';
import { IoMdSettings, IoIosNotifications } from 'react-icons/io';
import { MdEmail, MdHome, MdStar } from 'react-icons/md';
import { BsCalendar, BsChat } from 'react-icons/bs';
import { AiOutlineSearch, AiOutlineHeart } from 'react-icons/ai';
import { BiCamera, BiMusic } from 'react-icons/bi';
import '../../style/ad/ad.css';


const Ad = () => {
  return (
   <div className="ad">
    <div className="adb1"><img src={img1} alt='' className='ad-logo'></img>
    <h4 className='ad-title'>Wallet</h4></div>
    <div className="adb2">
    <h4 className='ad-title2'>--- Atom</h4>
    </div>



   </div>
  );
};

export default Ad;
