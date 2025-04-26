import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../axios';
import { logout } from '../redux/slices/auth';
import { Post } from '../apps/post/post';
import { 
  Avatar, Button, Typography, Grid, CircularProgress,
  Badge, IconButton, Tooltip, Alert, Box, Divider,
  Tabs, Tab, Fade, Snackbar
} from '@mui/material';
import {
  Verified as VerifiedIcon,
  Store as StoreIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Telegram as TelegramIcon,
  Public as PublicIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import { NotificationContext } from '../apps/tools/ui-menu/pushbar/pushbar';
import '../style/profile/profile.scss';
import { IoCopy } from "react-icons/io5";

const Profile = () => {
  const { toggleNotifications } = useContext(NotificationContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.data);
  
  const [state, setState] = useState({
    user: null,
    posts: [],
    isSubscribed: false,
    followersCount: 0,
    subscriptionsCount: 0,
    isLoading: true,
    error: null
  });

  const [activeTab, setActiveTab] = useState('posts');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const getAvatarUrl = (avatarPath) => 
    avatarPath?.startsWith('http') ? avatarPath : `https://atomglidedev.ru${avatarPath || '/default-avatar.jpg'}`;

  const getCoverUrl = (coverPath) => 
    coverPath?.startsWith('http') ? coverPath : `https://atomglidedev.ru${coverPath}`;

  const getThemeColor = () => {
    const theme = state.user?.theme || 'dark';
    const themes = {
      light: '#f5f5f5',
      dark: '#121212',
      blue: '#1e88e5',
      green: '#43a047',
      purple: '#8e24aa'
    };
    return themes[theme] || themes.dark;
  };

  const handleCopy = (text, message) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [profileRes, postsRes] = await Promise.all([
          axios.get(`/users/${id}`, { headers }),
          axios.get(`/posts/user/${id}`, { headers })
        ]);

        const userData = profileRes.data?.user || profileRes.data;
        if (!userData?._id) throw new Error('Неверный формат данных пользователя');

        const isSubscribed = userData.followers?.some(follower => 
          (follower === currentUser?._id) || (follower._id === currentUser?._id)
        );

        setState(prev => ({
          ...prev,
          user: userData,
          posts: postsRes.data || [],
          isSubscribed,
          followersCount: userData.followers?.length || 0,
          subscriptionsCount: userData.subscriptions?.length || 0,
          isLoading: false
        }));

      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err.response?.data?.message || err.message || 'Ошибка загрузки данных'
        }));
      }
    };

    fetchData();
  }, [id, currentUser?._id]);

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const method = state.isSubscribed ? 'delete' : 'post';
      await axios[method](`/users/${state.isSubscribed ? 'unsubscribe' : 'subscribe'}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setState(prev => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        followersCount: prev.isSubscribed 
          ? prev.followersCount - 1 
          : prev.followersCount + 1
      }));

    } catch (err) {
      console.error('Ошибка подписки:', err);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      dispatch(logout());
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const renderSocialLink = (platform, url) => {
    const icon = {
      twitter: <TwitterIcon />,
      instagram: <InstagramIcon />,
      facebook: <FacebookIcon />,
      telegram: <TelegramIcon />,
      github: <GitHubIcon />,
      linkedin: <LinkedInIcon />,
      website: <PublicIcon />
    }[platform.toLowerCase()] || <PublicIcon />;

    return (
      <Tooltip key={platform} title={platform.charAt(0).toUpperCase() + platform.slice(1)}>
        <IconButton 
          href={url.startsWith('http') ? url : `https://${url}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-icon"
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  };

  if (state.isLoading) {
    return (
      <div className="profile-loading">
        <CircularProgress />
      </div>
    );
  }

  if (state.error || !state.user) {
    return (
      <div className="profile-error">
        <Typography variant="h6">{state.error || 'Пользователь не найден'}</Typography>
      </div>
    );
  }

  const isCurrentUser = currentUser?._id === state.user._id;
  const hasPosts = state.posts.length > 0;
  const accountType = state.user.accountType || 'user';
  const showVerifiedBadge = accountType === 'verified_user';
  const showVerifiedBadg = accountType === 'admin';
  const showShopBadge = accountType === 'shop';
  const coverUrl = getCoverUrl(state.user.coverUrl);
  const themeColor = getThemeColor();
  const socialMedia = state.user.socialMedia || {};
  const hasSocialMedia = Object.values(socialMedia).some(val => val);

  return (
    <div className="profile-container" style={{ backgroundColor: themeColor }}>
      <div className="profile-banner">
        {coverUrl ? (
          <img src={coverUrl} className="banner-image" alt="Profile banner" />
        ) : (
          <div className="default-banner" style={{ backgroundColor: themeColor }} />
        )}
      </div>

      <div className="csv">
        <div className="profile-info-section">
          <div className="profile-avatar-container">
            <Avatar 
              alt={state.user.fullName} 
              src={getAvatarUrl(state.user.avatarUrl)} 
              sx={{ 
                width: 150, 
                height: 150,
                border: '5px solid white',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }} 
              className="profile-avatar" 
            />
          </div>

          <div className="profile-text-info">
            <div className='profile-name-container'>
              <h1 className='profile-name'>{state.user.fullName}</h1>
              {showVerifiedBadge && (
                <VerifiedIcon className='verified-badge' color="primary" />
              )}
              {showVerifiedBadg && (
                <VerifiedIcon className='verified-badge' color="primary" />
              )}
              {showShopBadge && (
                <StoreIcon className='shop-badge' color="primary" />
              )}
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          <div className='op'>
          {isCurrentUser ? (
            <button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/edit-profile/${state.user._id}`)}
              className="white-bth1"
            >
              Редактировать
            </button>
          ) : (
            <button
              variant={state.isSubscribed ? "outlined" : "contained"}
              startIcon={
                state.isSubscribed ? <PersonRemoveIcon /> : <PersonAddIcon />
              }
              onClick={handleSubscribe}
              className="white-bth1"
            >
              {state.isSubscribed ? 'Отписаться' : 'Подписаться'}
            </button>
          )}
          </div>
        </div>
        
        <div className='banner-pro-center'>
          <div className='d'>
            <div className="banner-pro3">
              <div className="pro-flex">
                <p className='pro-title2'>Подписчиков</p>
                <p className='pro-username2'>{state.followersCount}</p>
              </div>
            </div>  
          </div>
        </div>
      
        <div className='banner-pro-center'>
          <div className='d'>
            <div className="banner-pro">
              <div className="pro-flex">
                <p className='pro-title'>Имя пользователя</p>
                <p className='pro-username'>@{state.user.username?.replace('@', '')}</p>
              </div>
              <IconButton 
                onClick={() => handleCopy(`@${state.user.username?.replace('@', '')}`, 'Имя пользователя скопировано')}
                className="copy-button"
              >
                <IoCopy style={{ color: "rgb(0, 140, 255)", fill: "rgb(0, 140, 255)", width: "25px", height: "25px", marginRight:"30px" }} />
              </IconButton>
            </div>
            
            <div className="banner-pro1">
              <div className="pro-flex">
                <p className='pro-title'>Дата регистрации</p>
                <p className='pro-username'>{new Date(state.user.createdAt).toLocaleDateString()}</p>
              </div>
              <IconButton 
                onClick={() => handleCopy(new Date(state.user.createdAt).toLocaleDateString(), 'Дата регистрации скопирована')}
                className="copy-button"
              >
                <IoCopy style={{ color: "rgb(0, 140, 255)", fill: "rgb(0, 140, 255)", width: "25px", height: "25px" , marginRight:"30px"}} />
              </IconButton>
            </div>
            
            <div className="banner-pro1">
              <div className="pro-flex">
                <p className='pro-title'>ID пользователя</p>
                <p className='pro-username'>{state.user._id}</p>
              </div>
              <IconButton 
                onClick={() => handleCopy(state.user._id, 'ID пользователя скопирован')}
                className="copy-button"
              >
                <IoCopy style={{ color: "rgb(0, 140, 255)", fill: "rgb(0, 140, 255)", width: "25px", height: "25px" , marginRight:"30px" }} />
              </IconButton>
            </div>
            
            <div className="banner-pro2">
              <div className="pro-flex">
                <p className='pro-title'>О себе</p>
                <p className='pro-username'>{state.user.about || 'Не указано'}</p>
              </div>
              
            </div>
          </div>
        </div>
      
        <div className='banner-pro-center'>
          <div className='d'>
            <div className="banner-pro3">
              <div className="pro-flex">
                <p className='pro-title2'>Постов</p>
                <p className='pro-username2'>{state.posts.length}</p>
              </div>
            </div>  
          </div>
        </div>

        <div className="tab-content">
          <div>
            <div className="posts-section">
              <h2 className="posts-title">{isCurrentUser ? 'Мои публикации' : 'Публикации'}</h2>
              
              {hasPosts ? (
                <Grid container spacing={3}>
                  {state.posts.map(post => (
                    <Post
                      key={post._id}
                      _id={post._id}
                      title={post.title}
                      text={post.text}
                      imageUrl={post.imageUrl}
                      tags={post.tags}
                      viewsCount={post.viewsCount}
                      user={state.user}
                      createdAt={post.createdAt}
                      isEditable={isCurrentUser}
                      likesCount={post.likes?.count || 0}
                      dislikesCount={post.dislikes?.count || 0}
                      userReaction={post.userReaction}
                    />
                  ))}
                </Grid>
              ) : (
                <div className="no-posts">
                  <Typography variant="h5" color="textSecondary">
                    Нет статей для отображения
                  </Typography>
                  {isCurrentUser && (
                    <Typography variant="body1">
                      Создайте свою первую публикацию!
                    </Typography>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {isCurrentUser ? (
              <>
                <Tooltip title="Выйти из аккаунта">
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  className="action-btn"
                >
                  Выйти
                </Button>
              </Tooltip></>
            ) : (
           <></>
            )}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </div>
  );
};

export default Profile;
