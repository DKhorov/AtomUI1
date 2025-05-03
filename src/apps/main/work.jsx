import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, fetchTags } from '../../redux/slices/posts';
import { selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';
import { motion } from 'framer-motion';
import '../../style/work/work.scss';
import '../../style/work/dash.scss';
import { FiFolder } from "react-icons/fi";

import image from './y.gif';
import { PostsTabs } from './PostsTabs';
import Newpost from '../new-post/newpost';
import { Post } from '../post/post';
import { Link } from 'react-router-dom';
import Newpostm from '../new-post/newpost-mob';
import { FiCode, FiBook, FiSettings, FiPlus, FiSearch, FiBell, FiGrid , FiTerminal} from 'react-icons/fi';

const Work = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const { posts, tags } = useSelector(state => state.posts);
  const userData = useSelector(state => state.auth.data);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('all');
  const searchInputRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '{}');
    setProjects(Object.values(savedProjects));
    
    const token = window.localStorage.getItem('token');
    setIsAuthenticated(!!token || isAuth);
    
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [isAuth]);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    setIsAuthenticated(!!token || isAuth);
    
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [isAuth]);

  const [activeTab, setActiveTab] = useState('home');
  const [showTextArea, setShowTextArea] = useState(false);
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [postTags, setPostTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isModalmOpen, setIsModalmOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    setIsMounted(true);
  }, [dispatch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowTextArea(false);
    setShowTagsInput(false);
    setShowImageUpload(false);
  };

  const getPostAnimationStyle = (index) => ({
    animationDelay: `${index * 0.1}s`
  });

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  const popularPosts = [...posts.items]
    .sort((a, b) => (b.likes?.count || 0) - (a.likes?.count || 0))
    .slice(0, 10);

  const filteredPosts = posts.items.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    if (activeView === 'all') return matchesSearch;
    if (activeView === 'popular') return matchesSearch && popularPosts.some(p => p._id === post._id);
    if (activeView === 'photos') return matchesSearch && post.imageUrl;

    return matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 0);
    }
  };
  if (!window.localStorage.getItem('token') && !isAuth) {
    return (
      <div className="dark-github-home">
      {/* Hero Section */}
      
      <section className="hero-section">
        <div className="hero-container">
          <motion.div 
            className="hero-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">Built for developers</h1>
            <p className="hero-text">
              AtomGlide — проект, созданный для разработчиков. С его помощью они смогут делиться проектами, тренироваться и писать код на различных языках. Наше комьюнити, в котором уже более 150 человек, готово помочь каждому!
            </p>
          </motion.div>
          
          <motion.div 
            className="hero-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-image-container">
              <img 
                src={image}
                alt="Developer workspace" 
                className="hero-image"
              />
              <motion.div 
                className="image-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <motion.div 
            className="features-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="features-title">Get started with AtomGlide</h2>
            <p className="features-subtitle">Начинай работу в AtomGlide</p>
          </motion.div>
        

          <div className="features-grid">
            <Link to="/login">
              <motion.div 
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="card-icon">💳</div>
                <h3 className="card-title">Wallet в AtomGlide</h3>
                <p className="card-text">Совершай платежные операции в сети AtomGlide с помощью валюты Atom.</p>
              </motion.div>
            </Link>
       
              <motion.div 
                onClick={() => setIsModalOpen(true)}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="card-icon">🌐</div>
                <h3 className="card-title">AtomGlide Wizard</h3>
                <p className="card-text">Мастер для создания постов.</p>
              </motion.div>
              
     
          
              <Link to="/login">
              <motion.div 
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ y: -5 }}
              >
                <div className="card-icon">⛏️</div>
                <h3 className="card-title">AtomGlide Code</h3>
                <p className="card-text">Удобный редактор кода, похожий на Visual Studio Code.</p>
              </motion.div>
            </Link>
           
            <Link to="/login">
              <motion.div 
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ y: -5 }}
              >
                <div className="card-icon">⚡</div>
                <h3 className="card-title">AtomGLide Chats</h3>
                <p className="card-text">Присылай друзьям свои проекты в нашем мессенджере!</p>
              </motion.div>
            </Link>
          </div>
            
           
          
          <motion.div 
            className="see-more"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
          </motion.div>
        </div>
      </section>

      {/* Repository Section */}
      <section className="repository-section">
        <center>
          <div>
            <h2 className="features-title">Рекомендации</h2>
            <p className="features-subtitle">самые последние посты в atomglide</p>
          </div>
        </center>
        <div className="repository-container">
          {posts.items.map((post) => (
            <Post
              key={post._id}
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
                accountType: post.user?.accountType,
              }}
              createdAt={post.createdAt}
              isEditable={userData?._id === (post.user?._id || null)}
              likesCount={post.likes?.count || 0}
              dislikesCount={post.dislikes?.count || 0}
              userReaction={post.userReaction}
            />
          ))}
        </div>
      </section>

      {/* Open Source Section */}
      <section className="opensource-section">
        <center>
          <div>
            <h2 className="features-title">Популярные посты</h2>
            <p className="features-subtitle">самые Популярные посты в atomglide</p>
          </div>
        </center>
        <div className="repository-container">
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
      </section>

      {/* Tools Section */}
      <section className="tools-section">
        <div className="tools-container">
          <motion.h2 
            className="tools-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Реклама
          </motion.h2>
          
          <div className="tools-grid">
            <motion.div 
              className="tool-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="tool-title">Telegram канал автора</h3>
              <p className="tool-text">DK Studio Community - тг канал автора новости про проект и другое https://t.me/@dkdevelop</p>
            </motion.div>
            
            <motion.div 
              className="tool-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="tool-title">ТикТок канал автора</h3>
              <p className="tool-text">Обзоры про сервис только там @atomglide</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feed Section */}
      <section className="feed-section">
        <div className="feed-container">
          <motion.h2 
            className="feed-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            AtomGlide Version
          </motion.h2>
          
          <motion.div 
            className="feed-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="item-header">
              <span className="username">AtomGlide</span>
              <span className="action">Active version project</span>
              <span className="time"></span>
            </div>
            <div className="item-content">
              <span className="repo-name">v5.0</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    );
  }
  return (
    <div className="work-container">
      {isAuthenticated && (
        <>
          <Newpost
            isOpen={isModalOpen} 
            onClick={() => setIsModalOpen(true)}
            onClose={() => setIsModalOpen(false)}
          />
        <Newpostm 
  isOpen={isModalmOpen} 
  onClick={() => setIsModalmOpen(true)}
  onClose={() => setIsModalmOpen(false)}
/>
        </>
      )}
      <div className="main-page">

        {!isMobile && (
          <div className="dashs">
            <div className='dash'>
              <div className="dash-container">
                <h2 className='dash-title'>Привет {userData?.fullName || 'User'}!</h2>
                <center>                {isMobile ? <button className='white-bth' onClick={() => setIsModalmOpen(true)}>Создать пост</button> : <button className='white-bth' onClick={() => setIsModalOpen(true)}>Создать пост</button>  }   
                </center>
                <div className='dash-inc-project'>
                  <div className="dash-bth">
                    <h4 className="dash-inc-title">Твои проекты</h4>
                    <Link to="/code"><button className='dash-inc-bth'>Create</button></Link>
                  </div>
                  <div className="projects-list">
                    {projects.map(project => (
                      <div key={project.id} className="dash-inc-project2">
                        <FiFolder className='FiFolder'></FiFolder>
                        <p className="inc-pro-title">{project.name} ({project.type})</p>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <div className="dash-inc-project2">
                        <FiFolder className='FiFolder'></FiFolder>
                        <p className="inc-pro-title">Нет проектов</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="dash2">
              <h1 className="dash2-title">Твой баланс</h1>
              <h1 className="dash2-wallet">56</h1>
            </div>
          </div>
        )}
              <center>                {isMobile ? <button className='white-bth' onClick={() => setIsModalmOpen(true)}>Создать пост</button> : <></> }   
                </center>
        <div className="posts-dash">
          <div className="posts-filter">
            <input
              ref={searchInputRef}
              type="text"
              className='search-container'
              placeholder="Поиск постов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '6px',
                color: '#c9d1d9',
                fontSize: '14px',
                width: '200px',
                outline: 'none'
              }}
            />
            <div 
              className={`filter-tab ${activeView === 'all' ? 'active' : ''}`}
              onClick={() => setActiveView('all')}
            >
              Все посты
            </div>
            <div 
              className={`filter-tab ${activeView === 'popular' ? 'active' : ''}`}
              onClick={() => setActiveView('popular')}
            >
              Популярное
            </div>
            <div 
              className={`filter-tab ${activeView === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveView('photos')}
            >
              Фото
            </div>
          </div>

          {isPostsLoading ? (
            <div className="loading-posts">Загрузка постов...</div>
          ) : (
            <div className="posts-opd">
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post) => (
                  <Post
                    key={post._id}
                    _id={post._id}
                    imageUrl={post.imageUrl}
                    title={post.title}
                    text={post.text}
                    tags={post.tags}
                    viewsCount={post.viewsCount}
                    user={post.user || {}}
                    createdAt={post.createdAt}
                    likesCount={post.likes?.count || 0}
                    dislikesCount={post.dislikes?.count || 0}
                    userReaction={post.userReaction}
                    isEditable={userData?._id === (post.user?._id || null)}
                  />
                ))
              ) : (
                <div className="no-results" style={{ 
                  padding: '40px', 
                  textAlign: 'center', 
                  color: '#8b949e',
                  fontFamily: 'JetBrains Mono'
                }}>
                  {searchQuery ? 'Ничего не найдено' : 'Нет постов для отображения'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Work;