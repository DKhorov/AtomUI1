import React from 'react';
import img1 from '../../img/cs1.gif';
import { FaReact, FaShoppingCart, FaUser } from 'react-icons/fa';
import { GiCoffeeCup, GiShoppingBag } from 'react-icons/gi';
import { IoMdSettings, IoIosNotifications } from 'react-icons/io';
import { MdEmail, MdHome, MdStar } from 'react-icons/md';
import { BsCalendar, BsChat } from 'react-icons/bs';
import { AiOutlineSearch, AiOutlineHeart } from 'react-icons/ai';
import { BiCamera, BiMusic } from 'react-icons/bi';
import '../../style/store/store.scss';


const Store = () => {
  return (
   <div className="store">
    <div className="store-container">
        <center><img src={img1} alt='LOGO-Store' className='store-logo'></img></center>
        <h1 className="store-title">Добро пожаловать в магазин</h1>
        <h4 className="store-subtitle">магазин для NFT , постов , файлов и другого</h4>
        <h1 className="store-title">Пока набор товаров идет.. После 5 мая все будет раб</h1>

    </div>
   </div>
  );
};

export default Store;
