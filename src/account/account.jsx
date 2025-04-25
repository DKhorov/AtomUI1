import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../axios';
import { logout } from '../redux/slices/auth';
import { Post } from '../apps/post/post';
import { 
  Avatar, Button, Typography, Grid, CircularProgress,
  Badge, IconButton, Tooltip, Alert, Box, Divider,
  Tabs, Tab, Fade
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

        // Проверка подписки текущего пользователя
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

      // Обновляем состояние на основе предыдущего значения
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
          <p className="profile-email">@{state.user.username?.replace('@', '')}</p>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{state.followersCount}</span>
              <span className="stat-label">Подписчиков</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{state.subscriptionsCount}</span>
              <span className="stat-label">Подписок</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{state.posts.length}</span>
              <span className="stat-label">Постов</span>
            </div>
          </div>

        </div>
      </div>
      
      <div className="profile-actions">
        {isCurrentUser ? (
          <>
           <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/edit-profile/${state.user._id}`)}
                className="action-btn"
              >
                Редактировать
              </Button>
            
          </>
        ) : (
          <Button
            variant={state.isSubscribed ? "outlined" : "contained"}
            startIcon={
              state.isSubscribed ? <PersonRemoveIcon /> : <PersonAddIcon />
            }
            onClick={handleSubscribe}
            className="subscribe-btn"
          >
            {state.isSubscribed ? 'Отписаться' : 'Подписаться'}
          </Button>
        )}
      </div>

      <div className="profile-tabs">
        <Tabs 
          value={activeTab} 
          onChange={(e, newVal) => setActiveTab(newVal)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Публикации" value="posts" />
          <Tab label="О себе" value="about" />
          <Tab label="Информация" value="info" />
        </Tabs>
      </div>

      {/* Контент вкладок с полной заменой */}
      <div className="tab-content">
        {activeTab === 'posts' && (
          <Fade in={activeTab === 'posts'} timeout={500}>
            <div>
              <div className="posts-section">
                <h2 className="posts-title">{isCurrentUser ? 'Мои публикации' : 'Публикации'}</h2>
                
                {hasPosts ? (
                  <Grid container spacing={3}>
                    {state.posts.map(post => (
                        <Post
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
          </Fade>
        )}

        {activeTab === 'about' && (
          <Fade in={activeTab === 'about'} timeout={500}>
            <div>
              {state.user.about && (
                <div className="profile-about">
                  <h3>О себе</h3>
                  <p>{state.user.about}</p>
                </div>
              )}
            </div>
          </Fade>
        )}

        {activeTab === 'info' && (
          <Fade in={activeTab === 'info'} timeout={500}>
            <div>
              <div className="profile-additional-info">
                <h3>Дополнительная информация</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Дата регистрации:</span>
                    <span className='info-label'>{new Date(state.user.createdAt).toLocaleDateString()}</span>
                  </div>


                </div>
              </div>
              <div className="profile-additional-info">
                <h3>AtomGlide Account</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">{state.user._id}</span>
                  </div>
                  {isCurrentUser ? (
          <>
            <Tooltip title="Редактировать профиль">
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/edit-profile/${state.user._id}`)}
                className="action-btn"
              >
                Редактировать
              </Button>
            </Tooltip>
            
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
            </Tooltip>
          </>
        ) : (
          <></>
        )}
                  {state.user.location && (
                    <div className="info-item">
                      <span className="info-label">Местоположение:</span>
                      <span>{state.user.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Fade>
        )}
      </div>
    </div>
  );
};

export default Profile;