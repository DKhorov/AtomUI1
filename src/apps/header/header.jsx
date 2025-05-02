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

  return (
    <header className="github-header">
      <div className="header-container">
        <div className="header-left">
        <Link to="/" >
          <Avatar 
                alt={user?.fullName || 'User'} 
                src={image}
                sx={{ width: 32, height:32 }}
              /></Link>
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