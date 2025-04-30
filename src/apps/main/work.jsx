import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, fetchTags } from '../../redux/slices/posts';
import { selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';
import { PostCreationPanel } from './PostCreationPanel';
import { PostsTabs } from './PostsTabs';
import { FollowingPanel } from './FollowingPanel';
import '../../style/work/work.scss';
import OnlineUsers from './OnlineUsers';
import Ad from '../ad/ad';


const Work = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  useEffect(() => {
    setModalMessage('Это бета тест 2 до вторика ');
    setOpenModal(true);
  }, []);
  
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const { posts, tags } = useSelector(state => state.posts);
  const userData = useSelector(state => state.auth.data);
  
  const [activeTab, setActiveTab] = useState('home');
  const [isMounted, setIsMounted] = useState(false);
  const [showTextArea, setShowTextArea] = useState(false);
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [postTags, setPostTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    setIsMounted(true);
  }, [dispatch]);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowTextArea(false);
    setShowTagsInput(false);
    setShowImageUpload(false);
  };

  const onSubmit = async () => {
    if (!title.trim()) {
      setModalMessage('Пожалуйста, введите заголовок поста');
      setOpenModal(true);
      return;
    }
  
    try {
      setLoading(true);
  
      const postText = text.trim() || 'AtomGlide Post';
      const postTagsValue = postTags.trim() || 'нет текста';
  
      const fields = {
        title,
        imageUrl,
        tags: postTagsValue ? postTagsValue.split(',').map(tag => tag.trim()) : [],
        text: postText,
      };
  
      await axios.post('/posts', fields);
      
      setTitle('');
      setText('');
      setPostTags('');
      setImageUrl('');
      setShowTextArea(false);
      setShowTagsInput(false);
      setShowImageUpload(false);
      
      dispatch(fetchPosts());
    } catch (err) {
      console.warn(err);
      setModalMessage('Ошибка при создании поста!');
      setOpenModal(true);
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const postsWithImages = posts.items.filter(post => post.imageUrl);
  const shuffledPosts = shuffleArray(postsWithImages);

  const getPostAnimationStyle = (index) => ({
    animationDelay: `${index * 0.1}s`
  });

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="work-panel">

      {userData ? (
        <div className='panel-created'>
          <div className="posts-container">
          <OnlineUsers />
          <Ad />


            
            
            
            <PostsTabs
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              posts={posts}
              isPostsLoading={isPostsLoading}
              userData={userData}
              shuffledPosts={shuffledPosts}
              getPostAnimationStyle={getPostAnimationStyle}
              isMounted={isMounted}
            />

          </div>
        </div>
      ) : (
        <div className='panel-created'>
          <div className="posts-container">
            <PostsTabs
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              posts={posts}
              isPostsLoading={isPostsLoading}
              userData={userData}
              shuffledPosts={shuffledPosts}
              getPostAnimationStyle={getPostAnimationStyle}
              isMounted={isMounted}
            />
          </div>
        </div>
      )}

      <FollowingPanel userData={userData} isMounted={isMounted} />
      
    </div>
  );
};

export default Work;