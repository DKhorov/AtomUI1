import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../../redux/slices/posts';
import { Post } from '../post/post';
import '../../style/work/work.scss';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { selectIsAuth } from '../../redux/slices/auth';

const MePost = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector(state => state.posts);
  const userData = useSelector(state => state.auth.data);
  const [fadeIn, setFadeIn] = useState(false);
  const isAuth = useSelector(selectIsAuth);

  useEffect(() => {
    dispatch(fetchPosts());
    setTimeout(() => setFadeIn(true), 300);
  }, [dispatch]);

  const myPosts = posts.items.filter(post => post.user?._id === userData?._id);
  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="mepost-main">
 
      <div className="post-main">
        {myPosts.length > 0 ? (
          myPosts.map((post) => (
            <Post
                        key={post._id}
                        _id={post._id}
                        imageUrl={post.imageUrl}
                        title={post.title}
                        description={post.description} // Добавить эту строку
                        text={post.text}
                        tags={post.tags}
                        language={post.language}
                        viewsCount={post.viewsCount}
                        commentsCount={post.commentsCount}
                        user={post.user || {}} // Исправление ошибки accountType
                        createdAt={post.createdAt}
                        isEditable={userData?._id === (post.user?._id || null)}
                        likesCount={post.likes?.count || 0}
                        dislikesCount={post.dislikes?.count || 0}
                      />
          ))
        ) : (
          <p className="no-posts">У тебя пока нет постов.</p>
        )}
      </div>
    </div>
  );
};

export default MePost;
