import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, fetchUser } from '../../redux/slices/getme';
import { selectIsAuth } from '../../redux/slices/auth';
import '../../style/header/style.css';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import image from './Group 7.png';
import Newpost from '../new-post/newpost';
import Newpostm from '../new-post/newpost-mob';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuth);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalmOpen, setIsModalmOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  useEffect(() => {
    // Проверяем, было ли уже показано приветственное окно
    const wasWelcomeShown = localStorage.getItem('welcomeShown');
    if (!wasWelcomeShown) {
      setIsWelcomeModalOpen(true);
      localStorage.setItem('welcomeShown', 'true');
    }

    if (isAuth && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuth, user]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const userId = user?._id || '';
  const userName = user?.username || user?.fullName || 'User';

  const handleCloseWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
  };

  return (
    <header className="github-header">
      {/* Welcome Modal */}
      <Modal
        open={isWelcomeModalOpen}
        onClose={handleCloseWelcomeModal}
        aria-labelledby="welcome-modal-title"
        aria-describedby="welcome-modal-description"
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box sx={modalStyle}>
          <Avatar 
            alt="AtomGlide Logo" 
            src={user?.avatarUrl ? `https://atomglidedev.ru${user.avatarUrl}` : image} 
            sx={{ 
              width: 80, 
              height: 80,
              margin: '0 auto 16px',
              display: 'block',
              animation: 'bounce 2s infinite'
            }}
          />
          <Typography 
            id="welcome-modal-title" 
            variant="h6" 
            component="h2"
            sx={{ 
              textAlign: 'center',
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '1.5rem'
            }}
          >
            Добро пожаловать
          </Typography>
          <Typography 
            id="welcome-modal-description" 
            sx={{ 
              textAlign: 'center',
              marginBottom: '24px',
              color: 'text.secondary',
              fontSize: '1rem'
            }}
          >
            В новую версию AtomGlide 6
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleCloseWelcomeModal}
            sx={{
              display: 'block',
              margin: '0 auto',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              },
              padding: '8px 24px',
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            Продолжить
          </Button>
        </Box>
      </Modal>

      {isAuth && (
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
      <div className="header-container">
        <div className="header-left">
          <Link to="/">
            <Avatar 
              alt={userName} 
              src={image}
              sx={{ width: 32, height:32 }}
            />
          </Link>
          <Link to="/" className="nav-linkr">AtomGlide</Link>
        </div>

        <div className="header-right">
        
        {isAuth ? (
          
          userId ? (
            <>
            {isMobile ? (
              <button className='white-bth12' onClick={() => setIsModalmOpen(true)}>📝</button>
            ) : (
              <button className='white-bth1' onClick={() => setIsModalOpen(true)}>Создать пост</button>
            )}
            <Link to={`/account/profile/${userId}`} className='swe'>
              <div className="user-info-header">
                <Avatar 
                  alt={userName} 
                  src={user?.avatarUrl ? `https://atomglidedev.ru${user.avatarUrl}` : image} 
                  sx={{ width: 32, height:32 }}
                />
                <span className="user-name">{userName}</span>
              </div>
            </Link></>
          ) : (
            <div className="user-info-header">
              <Avatar 
                alt="Loading..." 
                src={image} 
                sx={{ width: 32, height:32 }}
              />
              <span className="user-name">Loading...</span>
            </div>
          )
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="sign-up">Sign in</Link>
            <Link to="/register" className="sign-up">Sign up</Link>
          </div>
        )}
      </div>
      </div>
    </header>
  );
};

// Modal styles
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '12px',
  outline: 'none',
  textAlign: 'center',
  '@media (max-width: 600px)': {
    width: '90%',
    p: 3
  }
};

export default Header;