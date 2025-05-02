import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, fetchTags } from '../../redux/slices/posts';
import Avatar from '@mui/material/Avatar';
import { fetchUser, selectUser } from '../../redux/slices/getme';
import image from '../../img/user-logo6.jpg';
import '../../style/menu/menu.scss';
import { selectIsAuth } from '../../redux/slices/auth';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import axios from '../../axios';
import CircularProgress from '@mui/material/CircularProgress';
import { UserInfo } from '../../account/UserInfo';
import { BsHouseDoor, BsFillHeartFill, BsConeStriped } from 'react-icons/bs';
import { FaCode, FaWallet } from 'react-icons/fa';
import { BsFillTagsFill, BsFillPersonFill, BsChatFill } from 'react-icons/bs';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { styled } from '@mui/system';

const Menu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuth);
  const [openFavoritesModal, setOpenFavoritesModal] = useState(false);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true); // Изменено на true для скрытия по умолчанию
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/users/favorites', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFavoritePosts(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFavorites = async (e) => {
    e.preventDefault();
    if (!isAuth) {
      alert('Для просмотра избранного нужно авторизоваться');
      return;
    }
    await fetchFavorites();
    setOpenFavoritesModal(true);
  };

  const handleCloseFavorites = () => {
    setOpenFavoritesModal(false);
  };

  const removeFromFavorites = async (postId) => {
    try {
      await axios.delete(`/users/favorites/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFavoritePosts(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      alert('Не удалось удалить из избранного');
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (!user) {
    return <div className='de'>Загрузка... Если долгая загрузка войди в аккаунт или прочти доку</div>;
  }
  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="mobile-menu-button" onClick={toggleMobileMenu}>
        <MenuIcon fontSize="large" />
      </div>

      <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <button className="collapse-btn" onClick={toggleCollapse}>
            {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </button>
        </div>
        <nav className="sidebar-menu">
          <Link to="/" className="menu-item" onClick={() => setCollapsed(true)}>
            <BsHouseDoor className="menu-icon" />
            {!collapsed && <span className="menu-text">Главная</span>}
          </Link>
          
          <Link to={`/code`} className="menu-item" onClick={() => setCollapsed(true)}>
            <FaCode className="menu-icon" />
            {!collapsed && <span className="menu-text">Код</span>}
          </Link>
          
          <Link to="/mini-apps" className="menu-item" onClick={() => setCollapsed(true)}>
            <BsFillTagsFill className="menu-icon" />
            {!collapsed && <span className="menu-text">Категории</span>}
          </Link>
          
          <Link onClick={(e) => {
            handleOpenFavorites(e);
            setCollapsed(true);
          }} className="menu-item">
            <BsFillHeartFill className="menu-icon" />
            {!collapsed && <span className="menu-text">Избранное</span>}
          </Link>
          
          <Link to="/priv" className="menu-item" onClick={() => setCollapsed(true)}>
            <BsChatFill className="menu-icon" />
            {!collapsed && <span className="menu-text">Чаты</span>}
          </Link>
          
          <Link to={`/account/profile/${user._id}`} className="menu-item" onClick={() => setCollapsed(true)}>
            <BsFillPersonFill className="menu-icon" />
            {!collapsed && <span className="menu-text">Профиль</span>}
          </Link>
          
          <Link to={`/wallet`} className="menu-item" onClick={() => setCollapsed(true)}>
            <FaWallet className="menu-icon" />
            {!collapsed && <span className="menu-text">Wallet</span>}
          </Link>
          
          <Link to={'/dock'} className="menu-item" onClick={() => setCollapsed(true)}>
            <BsConeStriped className="menu-icon" />
            {!collapsed && <span className="menu-text">Дока</span>}
          </Link>
        </nav>

        <Modal
          open={openFavoritesModal}
          onClose={handleCloseFavorites}
          aria-labelledby="favorites-modal-title"
          className="favorites-modal"
        >
          <Box className="modal-content">
            <h2 id="favorites-modal-title">
              <BookmarkIcon fontSize="large" />
              Мои сохраненные посты
            </h2>
            
            {loading ? (
              <div className="loading-spinner">
                <CircularProgress />
              </div>
            ) : favoritePosts.length > 0 ? (
              <div className="favorites-grid">
                {favoritePosts.map((post) => (
                  <div key={post._id} className="favorite-item">
                    <div onClick={() => {
                      navigate(`/posts/${post._id}`);
                      setCollapsed(true);
                    }} className="post-content">
                      <UserInfo 
                        {...post.user} 
                        additionalText={new Date(post.createdAt).toLocaleDateString()}
                        avatarUrl={post.user?.avatarUrl ? `https://atomglidedev.ru${post.user.avatarUrl}` : ''}
                      />
                      
                      <h3>{post.title}</h3>
                      
                      {post.imageUrl && (
                        <img 
                          src={`https://atomglidedev.ru${post.imageUrl}`} 
                          alt={post.title}
                          className="post-image"
                        />
                      )}
                      
                      <div className="post-stats">
                        <span>{post.viewsCount} просмотров</span>
                      </div>
                    </div>
                    
                    <IconButton
                      onClick={() => removeFromFavorites(post._id)}
                      className="delete-btn"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-favorites">
                <BookmarkIcon className="empty-icon" />
                <p>
                  У вас пока нет сохраненных постов.<br />
                  Нажмите на значок закладки в постах, чтобы сохранить понравившиеся.
                </p>
              </div>
            )}
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default Menu;