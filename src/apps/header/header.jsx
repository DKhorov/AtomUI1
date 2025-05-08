import React from 'react';
import { useSelector } from 'react-redux';
import { fetchUser, selectUser } from '../../redux/slices/getme';
import '../../style/header/style.css';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import image from './Group 7.png';
import { selectIsAuth } from '../../redux/slices/auth';

const Header = () => {
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuth);
  const isMaintenance = true; // Флаг технического обслуживания

  if (isMaintenance) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px'
      }}>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/4260/4260852.png" 
          alt="Maintenance" 
          style={{ width: '150px', marginBottom: '30px' }}
        />
        <h1 style={{ fontSize: '2rem', marginBottom: '15px' }}>
          Сайт на техническом обслуживании
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
          Идет обновление на новую стабильную версию AtomGlide
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '25px' }}>
          Сервер будет недоступен до 23:50
        </p>
        <a 
          href="https://t.me/jpegweb" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: '#0088cc',
            textDecoration: 'none',
            fontSize: '1.1rem',
            border: '2px solid #0088cc',
            padding: '8px 20px',
            borderRadius: '5px',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0088cc22'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          @jpegweb - Техподдержка
        </a>
      </div>
    );
  }

  return (
    <header className="github-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/">
            <Avatar 
              alt={user?.fullName || 'User'} 
              src={image}
              sx={{ width: 32, height:32 }}
            />
          </Link>
          <Link to="/" className="nav-linkr">AtomGlide</Link>
        </div>
        <div className="header-right">
          {isAuth ? (
            <div className="user-info-header">
              <Avatar 
                alt={user?.fullName || 'User'} 
                src={user?.avatarUrl ? `https://atomglidedev.ru${user.avatarUrl}` : image} 
                sx={{ width: 32, height:32 }}
              />
              <span className="user-name">{user?.fullName || 'User'}</span>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="sign-in">Sign in</Link>
              <Link to="/register" className="sign-up">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
