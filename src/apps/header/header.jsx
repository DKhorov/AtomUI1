import React, { useState, useEffect } from 'react';
import '../../style/header/style.css';
import { Link } from 'react-router-dom';
import Newpost from '../new-post/newpost';
import Newpostm from '../new-post/newpost-mob';

const Header = ({ isAuth = false }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentText, setCurrentText] = useState('AtomGlide');
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalmOpen, setIsModalmOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверка авторизации при загрузке компонента
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    setIsAuthenticated(!!token || isAuth);
  }, [isAuth]);

  // Проверка на мобильное устройство
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);
  };

  useEffect(() => {
    if (isAuthenticated) {
      updateTime();
      const timerId = setInterval(updateTime, 60000);
      return () => clearInterval(timerId);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const textTimer = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentText(prev => 
          prev === 'AtomGlide' 
            ? (isMobile ? 'Привет Мир!' : 'Скользи по волнам контента') 
            : 'AtomGlide'
        );
        setIsFlipping(false);
      }, 500);
    }, 10000);

    return () => clearInterval(textTimer);
  }, [isMobile]);

  return (
    <header className="panel-center">
      <div className="panel">
        {isAuthenticated && (
          <div className='balls-2' title='Валюта сервиса (читай доку)'>
            {isMobile ? (
              <h5 className='bl' onClick={() => setIsModalmOpen(true)}>Создать пост</h5>
            ) : (
              <h5 className='bl' onClick={() => setIsModalOpen(true)}>Создать пост</h5>
            )}
          </div>
        )}
        
        <Link 
          to="/" 
          className={`panel-text ${isFlipping ? 'flipping' : ''} ${isMobile ? 'mobile-text' : ''}`}
        >
          {currentText}
        </Link>
        
        {isAuthenticated && (
          <div className='balls' title='Текущее время'>
            <h5 className='bl'>{currentTime}</h5>
          </div>
        )}
      </div>
      
      {isAuthenticated && (
        <>
          <Newpost
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
          />
          <Newpostm
            isOpen={isModalmOpen} 
            onClose={() => setIsModalmOpen(false)}
          />
        </>
      )}
    </header>
  );
};

export default Header;