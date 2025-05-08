import React from 'react';
import { useSelector } from 'react-redux';
import { fetchUser, selectUser } from '../../redux/slices/getme';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import image from './Group 7.png';
import { selectIsAuth } from '../../redux/slices/auth';

const Header = () => {
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuth);
  const isMaintenance = true; // Флаг технического обслуживания

  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;

  const headerStyle = {
    position: 'fixed',
    top: '15px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: isMobile ? (isSmallMobile ? '300px' : '320px') : '450px',
    background: 'rgba(245, 247, 250, 0.98)',
    backdropFilter: 'blur(10px)',
    borderRadius: '14px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.02)',
    zIndex: 1100,
    padding: isMobile ? '6px 12px' : '8px 16px',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  };

  const headerLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '8px' : '12px',
  };

  const navLinkStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: isMobile ? (isSmallMobile ? '13px' : '14px') : '16px',
    fontWeight: 500,
    color: '#2d3748',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  };

  const headerRightStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '8px' : '10px',
  };

  const userNameStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: isMobile ? (isSmallMobile ? '12px' : '13px') : '14px',
    fontWeight: 500,
    color: '#2d3748',
  };

  const authButtonsStyle = {
    display: 'flex',
    gap: isMobile ? '8px' : '12px',
  };

  const signInStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: isMobile ? (isSmallMobile ? '12px' : '13px') : '14px',
    fontWeight: 500,
    textDecoration: 'none',
    padding: isMobile ? (isSmallMobile ? '4px 8px' : '5px 10px') : '6px 12px',
    borderRadius: '8px',
    color: '#2d3748',
    transition: 'background 0.2s ease, color 0.2s ease',
  };

  const signUpStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: isMobile ? (isSmallMobile ? '12px' : '13px') : '14px',
    fontWeight: 500,
    textDecoration: 'none',
    padding: isMobile ? (isSmallMobile ? '4px 8px' : '5px 10px') : '6px 12px',
    borderRadius: '8px',
    color: '#ffffff',
    background: '#4f46e5',
    transition: 'background 0.2s ease',
  };

  const maintenanceStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    color: '#2d3748',
  };

  const maintenanceImageStyle = {
    width: '150px',
    marginBottom: '30px',
  };

  const maintenanceTitleStyle = {
    fontSize: isMobile ? '1.5rem' : '2rem',
    marginBottom: '15px',
    fontWeight: 700,
  };

  const maintenanceTextStyle = {
    fontSize: isMobile ? '1rem' : '1.2rem',
    marginBottom: '10px',
    fontWeight: 500,
  };

  const maintenanceSubTextStyle = {
    fontSize: isMobile ? '0.9rem' : '1.1rem',
    marginBottom: '25px',
    fontWeight: 500,
  };

  const maintenanceLinkStyle = {
    color: '#4f46e5',
    textDecoration: 'none',
    fontSize: isMobile ? '0.9rem' : '1.1rem',
    fontWeight: 600,
    border: '2px solid #4f46e5',
    padding: isMobile ? '6px 16px' : '8px 20px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  if (isMaintenance) {
    return (
      <div style={maintenanceStyle}>
        <img 
          src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/9bb1d693658133.5e98ba7eb53fc.gif" 
          alt="Maintenance" 
          style={maintenanceImageStyle}
        />
        <h1 style={maintenanceTitleStyle}>
          Сайт на техническом обслуживании
        </h1>
        <p style={maintenanceTextStyle}>
          Идет обновление на новую стабильную версию AtomGlide
        </p>
        <p style={maintenanceSubTextStyle}>
          Сервер будет недоступен до 23:50
        </p>
        <a 
          href="https://t.me/jpegweb" 
          target="_blank" 
          rel="noopener noreferrer"
          style={maintenanceLinkStyle}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#4f46e522';
            e.target.style.color = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#4f46e5';
          }}
        >
          @jpegweb - Техподдержка
        </a>
      </div>
    );
  }

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={headerLeftStyle}>
          <Link to="/">
            <Avatar 
              alt={user?.fullName || 'User'} 
              src={image}
              sx={{ width: isMobile ? 24 : 28, height: isMobile ? 24 : 28 }}
            />
          </Link>
          <Link 
            to="/" 
            style={navLinkStyle}
            onMouseOver={(e) => (e.target.style.color = '#4f46e5')}
            onMouseOut={(e) => (e.target.style.color = '#2d3748')}
          >
            AtomGlide
          </Link>
        </div>
        <div style={headerRightStyle}>
          {isAuth ? (
            <div style={userInfoStyle}>
              <Avatar 
                alt={user?.fullName || 'User'} 
                src={user?.avatarUrl ? `https://atomglidedev.ru${user.avatarUrl}` : image} 
                sx={{ width: isMobile ? 24 : 28, height: isMobile ? 24 : 28 }}
              />
              <span style={userNameStyle}>{user?.fullName || 'User'}</span>
            </div>
          ) : (
            <div style={authButtonsStyle}>
              <Link 
                to="/login" 
                style={signInStyle}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(79, 70, 229, 0.1)';
                  e.target.style.color = '#4f46e5';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#2d3748';
                }}
              >
                Sign in
              </Link>
              <Link 
                to="/register" 
                style={signUpStyle}
                onMouseOver={(e) => (e.target.style.background = '#3b3a9b')}
                onMouseOut={(e) => (e.target.style.background = '#4f46e5')}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
