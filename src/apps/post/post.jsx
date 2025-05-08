import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../axios';
import { keyframes } from '@emotion/react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { FaPerson } from "react-icons/fa6";

import remarkGfm from 'remark-gfm';
import {
  Box,
  styled,
  Skeleton // Добавлен импорт Skeleton
} from '@mui/material';
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
import { themes } from 'prism-react-renderer';
import { BookmarkBorder as BookmarkBorderIcon, Bookmark as BookmarkIcon } from '@mui/icons-material';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  Clear as DeleteIcon,
  Edit as EditIcon,
  RemoveRedEyeOutlined as EyeIcon,
  FavoriteBorder as FavoriteIcon,
  Favorite as FavoriteFilledIcon,
  ThumbDownOutlined as ThumbDownIcon,
  ThumbDown as ThumbDownFilledIcon,
  MoreVert as MoreVertIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  Report as ReportIcon,
  Code as CodeIcon,
  
  Language as LanguageIcon,
  Close as CloseIcon
} from '@mui/icons-material';

import styles from '../../style/post/post.scss';
import { UserInfo } from '../../account/UserInfo';

const languageIcons = {
  JavaScript: <CodeIcon fontSize="small" />,
  TypeScript: <CodeIcon fontSize="small" />,
  Python: <CodeIcon fontSize="small" />,
  Java: <CodeIcon fontSize="small" />,
  'C#': <CodeIcon fontSize="small" />,
  'C++': <CodeIcon fontSize="small" />,
  PHP: <CodeIcon fontSize="small" />,
  Ruby: <CodeIcon fontSize="small" />,
  Swift: <CodeIcon fontSize="small" />,
  Kotlin: <CodeIcon fontSize="small" />,
  Dart: <CodeIcon fontSize="small" />,
  Other: <LanguageIcon fontSize="small" />
};

const PostSkeleton = () => {
  const colors = {
    background: '#0d1117',
    card: '#161b22',
    accent: '#58a6ff'
  };

  return (
    <div className='post-ad'>
      <div className='post-GHJ' style={{ background: colors.card }}>
        <div className="post-header" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Skeleton variant="circular" width={40} height={40} animation="wave" />
            <div style={{ flex: 1 }}>
              <Skeleton
                variant="text"
                width="40%"
                height={20}
                animation="wave"
                sx={{ bgcolor: colors.background }}
              />
              <Skeleton
                variant="text"
                width="30%"
                height={16}
                animation="wave"
                sx={{ bgcolor: colors.background }}
              />
            </div>
          </div>
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <Skeleton
            variant="rectangular"
            height={24}
            width="80%"
            animation="wave"
            sx={{ mb: 2, bgcolor: colors.background, borderRadius: 1 }}
          />
          
          <Skeleton
            variant="rectangular"
            height={16}
            width="90%"
            animation="wave"
            sx={{ mb: 1, bgcolor: colors.background, borderRadius: 1 }}
          />
          
          <Skeleton
            variant="rectangular"
            height={16}
            width="70%"
            animation="wave"
            sx={{ mb: 3, bgcolor: colors.background, borderRadius: 1 }}
          />

          <Skeleton
            variant="rectangular"
            height={200}
            animation="wave"
            sx={{ mb: 2, bgcolor: colors.background, borderRadius: 2 }}
          />

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                variant="rounded"
                width={80}
                height={24}
                animation="wave"
                sx={{ bgcolor: colors.background, borderRadius: 12 }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 24 }}>
            {[1, 2, 3, 4].map((item) => (
              <Skeleton
                key={item}
                variant="rounded"
                width={60}
                height={24}
                animation="wave"
                sx={{ bgcolor: colors.background, borderRadius: 12 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Post = ({
  _id,
  title = '',
  description = '',
  language = 'JavaScript',
  createdAt = '',
  imageUrl = '',
  text = '',
  user = {},
  viewsCount = 0,
  commentsCount = 0,
  tags = [],
  isEditable = false,
  likesCount = 0,
  dislikesCount = 0,
  userReaction = null,
  isFavorite = false,
  onFavoriteToggle,
  isFullPost = false
}) => {
  const userData = useSelector(state => state.auth.data);
  const navigate = useNavigate();
  
  const currentUserId = userData?._id || userData?.user?._id || userData?.user;
  const postAuthorId = user?._id || user;
  const isAuthor = currentUserId && postAuthorId && String(currentUserId) === String(postAuthorId);
  const colors = {
    primary: '#9147ff',
    secondary: '#772ce8',
    background: '#0d1117',
    card: '#161b22',
    text: '#c9d1d9',
    accent: '#58a6ff'
  };
  
  const CodeBlock = styled(Box)(({ theme }) => ({
    backgroundColor: colors.card,
    padding: theme.spacing(2),
    borderRadius: '8px',
    overflowX: 'auto',
    fontFamily: 'monospace',
    margin: theme.spacing(2, 0),
    borderLeft: `4px solid ${colors.accent}`
  }));
  
  const [reactionData, setReactionData] = React.useState({
    likesCount,
    dislikesCount,
    userReaction
  });
  const [favorite, setFavorite] = React.useState(isFavorite);
  const [isReacting, setIsReacting] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  React.useEffect(() => {
    setReactionData({ likesCount, dislikesCount, userReaction });
    setFavorite(isFavorite);
  }, [likesCount, dislikesCount, userReaction, isFavorite]);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleFavorite = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!currentUserId) {
      alert('Для этого действия нужно авторизоваться');
      return;
    }

    try {
      if (favorite) {
        await axios.delete(`/users/favorites/${_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        await axios.post('/users/favorites', { postId: _id }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      setFavorite(!favorite);
      if (onFavoriteToggle) onFavoriteToggle(_id, !favorite);
    } catch (err) {
      console.error('Error updating favorites:', err.response?.data || err);
      alert(err.response?.data?.error || 'Ошибка сервера');
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    handleMenuClose();
    if (navigator.share) {
      navigator.share({
        title: title,
        text: 'Посмотрите этот пост:',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена');
    }
  };

  const handleReport = (e) => {
    e.stopPropagation();
    handleMenuClose();
    alert('Жалоба отправлена модераторам');
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`/posts/${_id}`);
      alert("Пост успешно удален");
      window.location.reload();
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Не удалось удалить пост');
    }
    setDeleteDialogOpen(false);
  };

  const handleReaction = async (type, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!currentUserId) {
      alert('Для этого действия нужно авторизоваться');
      return;
    }
    if (isReacting) return;
    setIsReacting(true);

    try {
      const currentReaction = reactionData.userReaction;
      const newReaction = currentReaction === type ? null : type;

      setReactionData(prev => {
        let newLikes = prev.likesCount;
        let newDislikes = prev.dislikesCount;

        if (type === 'like') {
          if (currentReaction === 'like') {
            newLikes -= 1;
          } else if (currentReaction === 'dislike') {
            newDislikes -= 1;
            if (newReaction) newLikes += 1;
          } else {
            if (newReaction) newLikes += 1;
          }
        } else if (type === 'dislike') {
          if (currentReaction === 'dislike') {
            newDislikes -= 1;
          } else if (currentReaction === 'like') {
            newLikes -= 1;
            if (newReaction) newDislikes += 1;
          } else {
            if (newReaction) newDislikes += 1;
          }
        }

        return {
          likesCount: newLikes,
          dislikesCount: newDislikes,
          userReaction: newReaction
        };
      });

      if (currentReaction) {
        await axios.delete(`/posts/reaction/${_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      
      if (newReaction) {
        await axios.post(`/posts/${newReaction}/${_id}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
    } catch (err) {
      console.error('Ошибка реакции:', err);
      alert('Бро ты уже ставил эту реакцию на пост ');
      setReactionData({
        likesCount,
        dislikesCount,
        userReaction
      });
    } finally {
      setIsReacting(false);
    }
  };

  const processImageUrl = (url) => 
    url?.startsWith('http') ? url : `https://atomglidedev.ru${url}`;
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);

  const handleImageOpen = () => setIsImageModalOpen(true);
  const handleImageClose = () => setIsImageModalOpen(false);

console.log(description)
  return (
    <div className='post-ad'  >
      <div className='post-GHJ'>
        {/* Шапка поста */}
        <div className="post-header">
          <div onClick={(e) => { e.stopPropagation(); navigate(`/account/profile/${postAuthorId}`); }}>
 
<UserInfo 
{...user} 
additionalText={createdAt}
avatarUrl={processImageUrl(user?.avatarUrl)}
accountType={user?.accountType} // Используйте опциональную цепочку
/>
          </div>
          

          <div>
            <IconButton onClick={handleMenuClick} size="small">
              <MoreVertIcon />
            </IconButton>
            <IconButton onClick={handleFavorite}>
              {favorite ? (
                <BookmarkIcon color="primary" />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
          </div>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
             {isAuthor && (
                          <>
            
                            <MenuItem onClick={() => setDeleteDialogOpen(true)}>
                              <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
                              Удалить
                            </MenuItem>
                          </>
                        )}
            <MenuItem onClick={handleShare}>
              <ListItemIcon><ShareIcon fontSize="small" /></ListItemIcon>
              Поделиться
            </MenuItem>
            
      
            
          
            <MenuItem onClick={() => !isFullPost && navigate(`/posts/${_id}`)}>
              <ListItemIcon><FaPerson fontSize="big"  /></ListItemIcon>
              Открыть пост
            </MenuItem>
            <MenuItem onClick={handleReport}>
              <ListItemIcon><ReportIcon fontSize="small" /></ListItemIcon>
              Пожаловаться
            </MenuItem>
          </Menu>
        </div>
        <h2 
  className='title-GHJ' 
  onClick={(e) => {
    e.stopPropagation(); // Добавляем остановку всплытия
    if (!isFullPost) {
      navigate(`/posts/${_id}`);
    }
  }}
>
  {title}
</h2>
        <p className='post-description2' >{description}</p>
        {/* Изображение */}
        {imageUrl && (
        <div 
          className="image-container"
          onClick={handleImageOpen} // Изменено здесь
        >
          <img
            className='img-IKLS'
            src={processImageUrl(imageUrl)}
            alt={title}
            loading="eager"
            onClick={() => !isFullPost && navigate(`/posts/${_id}`)}
          />
        </div>
      )}
        {/* Основной контент */}
        <div 
          className="post-content"
         
        >
          
          
          {isFullPost && text && (
            <div className="description-GHJ">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return (
                    
                      <CodeBlock className="inline-code" {...props}>
                        {children}
                      </CodeBlock>
                    );
                  },
                  img: ({ node, ...props }) => (
                    <img 
                      {...props} 
                      src={processImageUrl(props.src)}
                      className="post-image"
                      loading="eager"
                      decoding="async"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/600x400?text=Image+not+found';
                      }}
                    />
                  )
                }}
              >
                {text}
              </ReactMarkdown>
            </div>
            
          )}

<Dialog
        open={isImageModalOpen}
        onClose={handleImageClose}
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            background: colors.background,
            display: 'flex',
            flexDirection: 'column',
          }
        }}
      >
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
          <IconButton onClick={handleImageClose} sx={{ color: colors.text }}>
          <CloseIcon fontSize="large" /> {/* Исправлено здесь */}

          </IconButton>
        </DialogActions>

        <DialogContent sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <img
            src={processImageUrl(imageUrl)}
            alt={title}
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />
          
          <Box sx={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(13, 17, 23, 0.8)',
            padding: 2,
            borderRadius: '8px',
            backdropFilter: 'blur(8px)'
          }}>
            <UserInfo 
              {...user} 
              additionalText={new Date(createdAt).toLocaleDateString()}
              avatarUrl={processImageUrl(user?.avatarUrl)}
              sx={{ color: colors.text }}
            />
          </Box>
        </DialogContent>
      </Dialog>
          <div className="meta-info">
            <div className='tags-GHJ'>
              <Chip
                icon={languageIcons[language] || languageIcons.Other}
                label={language}
                variant="outlined"
                size="small"
                sx={{ 
                  color: '#18a3f9',
                  borderColor: 'rgba(24, 163, 249, 0.3)',
                  bgcolor: 'rgba(24, 163, 249, 0.08)'
                }}
              />
            </div>
            {tags.length > 0 && (
              <div className='tags-GHJ'>
                {tags.map((tag, i) => (
                  <Chip
                    key={i}
                    label={`#${tag}`}
                    component={Link}
                    to={`/tags/${tag}`}
                    clickable
                    size="small"
                    variant="outlined"
                    sx={{
                      color: '#18a3f9',
                      borderColor: 'rgba(24, 163, 249, 0.3)',
                      bgcolor: 'rgba(24, 163, 249, 0.08)',
                      '&:hover': { bgcolor: 'rgba(24, 163, 249, 0.15)' }
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Блок действий */}
          <div className="post-actions">
          <div className="action-btn">
              <EyeIcon fontSize="small" />
              <span>{viewsCount}</span>
            </div>

  <div 
    className={`action-btn ${reactionData.userReaction === 'like' ? 'active' : ''}`}
    onClick={(e) => handleReaction('like', e)}
  >
    {reactionData.userReaction === 'like' ? (
      <FavoriteFilledIcon fontSize="small" />
    ) : (
      <FavoriteIcon fontSize="small" />
    )}
    <span>{reactionData.likesCount}</span>
  </div>

  <div 
    className={`action-btn ${reactionData.userReaction === 'dislike' ? 'active' : ''}`}
    onClick={(e) => handleReaction('dislike', e)}
  >
    {reactionData.userReaction === 'dislike' ? (
      <ThumbDownFilledIcon fontSize="small" />
    ) : (
      <ThumbDownIcon fontSize="small" />
    )}
    <span>{reactionData.dislikesCount}</span>
  </div>

  <div className="action-btn">
    <CommentIcon fontSize="small" />
    <span>{commentsCount}</span>
  </div>
</div>
        
        </div>

        {/* Блок действий */}
   
      </div>

      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        className="delete-dialog"
      >
        <DialogTitle>Удалить пост навсегда?</DialogTitle>
        <DialogContent>
          <DialogContentText>Это действие нельзя отменить.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <button onClick={handleDeletePost} className='bth-white9'>Удалить</button>
        </DialogActions>
      </Dialog>
    </div>
  );
};