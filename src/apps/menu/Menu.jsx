import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../style/menu/menu.scss';
import { FaFireFlameCurved, FaPerson } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { FiCheckSquare } from "react-icons/fi";
import { FiCode } from "react-icons/fi";
import { FiAward } from "react-icons/fi";
import { FiBookmark } from "react-icons/fi";
import { Navigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import axios from '../../axios';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import { selectIsAuth } from '../../redux/slices/auth';
import { fetchUser, selectUser } from '../../redux/slices/getme';
import { useSelector, useDispatch } from 'react-redux';
import { Post } from '../post/post';
import { keyframes, styled } from '@mui/system';
import { UserInfo } from '../../account/UserInfo';
import Modal from '@mui/material/Modal';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { BsFillRssFill } from "react-icons/bs";
import { BsChatFill } from "react-icons/bs";
import { BsFillCupHotFill } from "react-icons/bs";
import { BsFillTagsFill } from "react-icons/bs";
import { BsFillPersonFill } from "react-icons/bs";
import { FaStore } from "react-icons/fa";
import { BsBoxFill } from "react-icons/bs";
import { FaCode } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(3px)',
  animation: `${fadeIn} 0.3s ease-out forwards`,
});

const AnimatedPost = styled('div')(({ delay }) => ({
  animation: `${slideIn} 0.3s ease-out ${delay * 0.1}s forwards`,
  opacity: 0,
  position: 'relative',
  border: '1px solid #30363d',
  borderRadius: '6px',
  padding: '16px',
  backgroundColor: '#161b22',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)'
  }
}));

const Menu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [openFavoritesModal, setOpenFavoritesModal] = useState(false);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const { data } = await axios.get('/posts/tags/all');
        const sortedTags = data.sort((a, b) => b.count - a.count).slice(0, 3);
        setPopularTags(sortedTags);
      } catch (err) {
        console.error('Ошибка при загрузке популярных тегов:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTags();
  }, []);

  useLayoutEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

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

  const handleThemeClick = (themeName) => {
    navigate(`/tags/${themeName.toLowerCase()}`);
  };

  const handleTagClick = (tagName) => {
    navigate(`/tags/${tagName}`);
  };

  if (isMobile) return null;

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const themes = [
    { name: 'Python', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQpDU7-J_NbGKkHAlMRWgdFRqoj5vK3DehTQ&s' },
    { name: 'HTML', image: 'https://www.itss.paris/sites/itss-dev/files/styles/scaling_cropping_1200x800/public/2017-12/HTML5_0_0.jpg?itok=bnzL8xFI' },
    { name: 'React', image: 'https://kasterra.github.io/images/thumbnails/React.png' },
    { name: 'JavaScript', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuHnJDLOcdm_0b6N6kNj-1OvO9KhKYgqIy0w&s' },
    { name: 'News', image: 'https://st2.depositphotos.com/6789684/12262/v/450/depositphotos_122620866-stock-illustration-illustration-of-flat-icon.jpg' },
    { name: 'Atom Практикум', image: 'https://cdn-icons-png.flaticon.com/512/4366/4366867.png' }
  ];

  return (
    <div className="dtf-menu">
      <div className="dft-menu-container">
        <div className="dft-button">
          <Link to="/" className={`dft-bth ${isActive('/')}`}>
            <IoMdTime className='qazwsx'></IoMdTime>
            Свежее
          </Link>
          <Link to="/popular" className={`dft-bth ${isActive('/popular')}`}>
            <FaFireFlameCurved className='qazwsx'></FaFireFlameCurved>
            Популярное
          </Link>
          <Link to="/mypost" className={`dft-bth ${isActive('/mypost')}`}>
            <FiCheckSquare className='qazwsx'></FiCheckSquare>
            Моя лента
          </Link>
          <Link to="/code" className={`dft-bth ${isActive('/account/profile')}`}>
            <FiCode className='qazwsx'></FiCode>
            Код
          </Link>
          <Link to="/rev" className={`dft-bth ${isActive('/account/profile')}`}>
            <FiAward className='qazwsx'></FiAward>
            Темы
          </Link>
          <Link onClick={handleOpenFavorites} className={`dft-bth ${isActive('/account/profile')}`}>
            <FiBookmark className='qazwsx'></FiBookmark>
            Избранное
          </Link>
        </div>
        <div className="dft-theme">
          <h5 className='ft-theme-title'>Темы</h5>
          {themes.map((theme, index) => (
            <div 
              className="theme-pos" 
              key={index}
              onClick={() => handleThemeClick(theme.name)}
              style={{ cursor: 'pointer' }}
            >
              <Avatar 
                alt={theme.name} 
                src={theme.image}
                sx={{ width: 32, height:32 }}
              />
              <h4 className='pos-title'>{theme.name}</h4>
            </div>
          ))}
        </div>
        <div className="dft-theme">
          <h5 className='ft-theme-title'>Популярные теги</h5>
          {loading ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress size={20} />
            </Box>
          ) : (
            popularTags.map((tag, index) => (
              <div 
                className="tg-cont" 
                key={index}
                onClick={() => handleTagClick(tag.name)}
                style={{ cursor: 'pointer' }}
              >
                <h4 className="tg-title">#{tag.name} ({tag.count})</h4>
              </div>
            ))
          )}
        </div>
      </div>
      <StyledModal
        open={openFavoritesModal}
        onClose={handleCloseFavorites}
        aria-labelledby="favorites-modal-title"
      >
        <Box sx={{
          width: '90%',
          maxWidth: '1200px',
          maxHeight: '90vh',
          bgcolor: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: '6px',
          boxShadow: 24,
          p: 4,
          overflowY: 'auto',
          color: '#c9d1d9',
          outline: 'none'
        }}>
          <h2 id="favorites-modal-title" style={{ 
            color: '#f0f6fc', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <BookmarkIcon fontSize="large" />
            Мои сохраненные посты
          </h2>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : favoritePosts.length > 0 ? (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {favoritePosts.map((post) => (
                <div 
                  key={post._id} 
                  style={{
                    position: 'relative',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '16px',
                    backgroundColor: '#161b22',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <div onClick={() => navigate(`/posts/${post._id}`)} style={{ cursor: 'pointer' }}>
                    <UserInfo 
                      {...post.user} 
                      additionalText={new Date(post.createdAt).toLocaleDateString()}
                      avatarUrl={post.user?.avatarUrl ? `https://atomglidedev.ru${post.user.avatarUrl}` : ''}
                    />
                    
                    <h3 style={{ color: '#f0f6fc', margin: '10px 0' }}>{post.title}</h3>
                    
                    {post.imageUrl && (
                      <img 
                        src={`https://atomglidedev.ru${post.imageUrl}`} 
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          marginBottom: '10px'
                        }}
                      />
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8b949e' }}>
                      <span>{post.viewsCount} просмотров</span>
                    </div>
                  </div>
                  
                  <IconButton
                    onClick={() => removeFromFavorites(post._id)}
                    sx={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      color: '#f85149',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '200px',
              color: '#8b949e',
              animation: `${fadeIn} 0.3s ease-out`
            }}>
              <BookmarkIcon sx={{ fontSize: '48px', mb: 2 }} />
              <p style={{ textAlign: 'center' }}>
                У вас пока нет сохраненных постов.<br />
                Нажмите на значок закладки в постах, чтобы сохранить понравившиеся.
              </p>
            </Box>
          )}
        </Box>
      </StyledModal>
    </div>
  );
};

export default Menu;