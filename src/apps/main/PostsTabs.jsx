import React, { useState } from 'react';
import { Box, CircularProgress, Typography, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { Post } from '../post/post';
import { useNavigate } from 'react-router-dom';

export const PostsTabs = ({
  activeTab,
  handleTabChange,
  posts,
  isPostsLoading,
  userData,
  shuffledPosts,
  getPostAnimationStyle,
  isMounted
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredPosts = posts.items.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.text.toLowerCase().includes(query) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query))) ||
      (post.user?.fullName && post.user.fullName.toLowerCase().includes(query))
    );
  });

  const clearSearch = () => {
    setSearchQuery('');
  };

  const popularPosts = [...posts.items]
    .sort((a, b) => (b.likes?.count || 0) - (a.likes?.count || 0))
    .slice(0, 10);

  if (isPostsLoading) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(24, 24, 40, 0.2)",
          zIndex: 9999,
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: "white",
            marginBottom: "20px",
          }}
        />
        <Typography variant="h6" sx={{ color: "white", marginBottom: "10px" }}>
          AtomGlide
        </Typography>
      </Box>
    );
  }

  return (
    <div className={`DS2 animate-fade-in ${isMounted ? 'delay-2' : ''}`}>
      <div className="tab-slider">
        <div className="tab-slider-container">
          <button
            className={`tab-slider-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleTabChange('home')}
          >
            Home
          </button>
          <button
            className={`tab-slider-button ${activeTab === 'popular' ? 'active' : ''}`}
            onClick={() => handleTabChange('popular')}
          >
            Popular
          </button>
          <button
            className={`tab-slider-button ${activeTab === 'photo' ? 'active' : ''}`}
            onClick={() => handleTabChange('photo')}
          >
            Photo
          </button>
          <button
            className={`tab-slider-button ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => handleTabChange('news')}
          >
            News
          </button>
          <div 
            className="tab-slider-indicator"
            style={{
              width: 'calc(25% - 10px)',
              left: activeTab === 'home' ? '5px' : 
                    activeTab === 'popular' ? 'calc(25% + 5px)' : 
                    activeTab === 'photo' ? 'calc(50% + 5px)' :
                    'calc(75% + 5px)'
            }}
          />
        </div>
      </div>

      <div className={`search-panel ${isSearchFocused ? 'focused' : ''}`}>
        <SearchIcon className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Поиск постов, тегам или авторам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        {searchQuery && (
          <IconButton 
            className="clear-search-button" 
            onClick={clearSearch}
            size="small"
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </div>

      {activeTab === 'photo' ? (
        <div className="pinterest-grid">
          {shuffledPosts.length > 0 ? (
            shuffledPosts.map((post, index) => (
              <div 
                key={post._id} 
                className="pinterest-item post-animate"
                style={getPostAnimationStyle(index)}
                onClick={() => navigate(`/posts/${post._id}`)}
              >
                {post.imageUrl && (
                  <>
                    <img
                      src={`https://atomglidedev.ru${post.imageUrl}`}
                      alt={post.title}
                      className="pinterest-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-image.png';
                      }}
                    />
                    {post.title && (
                      <div className="image-overlay">
                        <p className="image-title">{post.title}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <div className={`load-text animate-fade-in ${isMounted ? 'delay-3' : ''}`}>
              Нет фото для отображения
            </div>
          )}
        </div>
      ) : activeTab === 'news' ? (
        <div className="news-container">
          <h2 className="news-title">Важные объявления</h2>
          {posts.items.filter(post => post.tags && post.tags.includes('alert')).length > 0 ? (
            posts.items
              .filter(post => post.tags && post.tags.includes('alert'))
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post, index) => (
                <div 
                  key={post._id} 
                  className="alert-post post-animate"
                  style={getPostAnimationStyle(index)}
                >
                  <Post
                    _id={post._id}
                    imageUrl={post.imageUrl}
                    title={post.title}
                    text={post.text}
                    tags={post.tags}
                    user={post.user || {}}
                    createdAt={post.createdAt}
                    isEditable={userData?._id === (post.user?._id || null)}
                  />
                </div>
              ))
          ) : (
            <div className="no-alerts">
              На данный момент нет важных объявлений
            </div>
          )}
        </div>
      ) : activeTab === 'popular' ? (
        <div className="popular-posts-container">
          <h2 className="news-title">Популярные посты</h2>
          {popularPosts.length > 0 ? (
            popularPosts.map((post, index) => (
              <div 
                key={post._id} 
                className="post-animate"
                style={getPostAnimationStyle(index)}
              >
                <Post
                  _id={post._id}
                  imageUrl={post.imageUrl}
                  title={post.title}
                  text={post.text}
                  tags={post.tags}
                  language={post.language}
                  viewsCount={post.viewsCount}
                  commentsCount={post.commentsCount}
                  user={post.user || {}}
                  createdAt={post.createdAt}
                  isEditable={userData?._id === (post.user?._id || null)}
                  likesCount={post.likes?.count || 0}
                  dislikesCount={post.dislikes?.count || 0}
                  userReaction={post.userReaction}
                />
              </div>
            ))
          ) : (
            <div className="no-posts-found">
              <p>Нет популярных постов</p>
            </div>
          )}
        </div>
      ) : filteredPosts.length > 0 ? (
        [...filteredPosts]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((post, index) => (
            <div 
              key={post._id} 
              className="post-animate"
              style={getPostAnimationStyle(index)}
            >
              <Post
                _id={post._id}
                imageUrl={post.imageUrl}
                title={post.title}
                text={post.text}
                tags={post.tags}
                language={post.language}
                viewsCount={post.viewsCount}
                commentsCount={post.commentsCount}
                user={{
                  ...(post.user || {}),
                  accountType: post.user?.accountType, // Добавлена запятая
                }}
                createdAt={post.createdAt}
                isEditable={userData?._id === (post.user?._id || null)}
                likesCount={post.likes?.count || 0}
                dislikesCount={post.dislikes?.count || 0}
                userReaction={post.userReaction}
              />
            </div>
          ))
      ) : (
        <div className="no-posts-found">
          <p>Посты не найдены</p>
          {searchQuery && (
            <button 
              className="clear-search-button"
              onClick={clearSearch}
            >
              Очистить поиск
            </button>
          )}
        </div>
      )}
    </div>
  );
};