import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../axios';
import img1 from '../../img/cs2.gif';
import { FaWallet } from 'react-icons/fa';
import '../../style/ad/ad.css';

const Ad = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector(state => state.auth.userId);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get('/balance', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        

        
        setBalance(response.data.balance || 0);

        setLoading(false);
        
      
      } catch (err) {
        console.error('Ошибка при получении баланса:', err);
        setError('Не удалось загрузить баланс');
        setLoading(false);
      }
    };

    fetchBalance();
  }, [userId, token]);

  return (
    <div className="ad">
      <div className="adb1">
        <img src={img1} alt='' className='ad-logo' />
        <h4 className='ad-title'>Wallet</h4>
      </div>
      <div className="adb2">

        <h4 className='ad-title2'> 
         {balance.toFixed(2)}</h4>
      </div>
    </div>
  );
};

export default Ad;
