import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from './apps/header/header';
import Menu from './apps/menu/Menu';
import MenuMusic from './apps/menu/Menu-music';
import Music from './apps/main/music';
import Work from './apps/main/work';
import PopularMusic from './apps/main/PopularMusic';
import QAZ from './apps/main/panel';
import Rev from './apps/main/rev';
import Time from './apps/main/time';
import { FullPost } from './apps/fullpost/FullPost';
import {Mobile} from './apps/menu/menu-mob';
import Dock from "./apps/menu/dock";
import Profile from './account/account';
import Code from './code/index';
import Wallet from './apps/wallet/wallet';
import { SnackbarProvider } from 'notistack';
import Login from "./apps/setup/Login";
import RegistrationForm from "./apps/setup/Registration";
import { fetchAuthMe } from "./redux/slices/auth";
import AdminPanel from './apps/tools/admin';
import ProfileEdit from './apps/edit-account/edit';
import MiniApps from './apps/mini-apps/mini-apps';
import {TagsPage} from './apps/mini-apps/TagsPage';
import SurveyForm from './apps/mini-apps/application/form';
import FileEditor from './apps/mini-apps/application/code';
import MePost from './apps/main/mypost';
import ArtistList from './apps/main/ArtistList';
import ArtistPage from './apps/main/ArtistPage';

const PrivateRoute = ({ children }) => {
  const isAuth = useSelector(state => state.auth.isAuth);
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token && !isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppRouter = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = React.useState(false);
  const location = useLocation();
  const isAuth = useSelector(state => state.auth.isAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
    
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
      const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/g.test(userAgent);
      setIsMobile(isMobileDevice || isTablet);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [dispatch]);

  // УДАЛИЛИ проблемный эффект, который блокировал скролл
  // Вместо этого каждый компонент должен управлять своим скроллом самостоятельно

  return (
    <div className="app-container">
      <SnackbarProvider maxSnack={3}>
        <Routes>
          {/* Public routes */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/dock" element={<Dock />} />
          <Route path="/apps/atomform" element={<SurveyForm />} />
          <Route path="/apps/thecode" element={<FileEditor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/code" element={<Code />} />

          {/* Protected routes */}
          <Route path="/*" element={
            <PrivateRoute>
              <>
                <Header />
                {isMobile && <Mobile />}
                <div className='flex-container'>
                  <Routes>
                    <Route path="/" element={
                      <div className='main-container'>
                        <Menu />
                        <Time />
                        <QAZ />
                      </div>
                    } />
                    <Route path="/popular" element={
                      <div className='main-container'>
                        <Menu />
                        <Work />
                        <QAZ />
                      </div>
                    } />
                    <Route path="/mypost" element={
                      <div className='main-container'>
                        <Menu />
                        <MePost />
                        <QAZ />
                      </div>
                    } />
                    <Route path="/mini-apps" element={<MiniApps />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/posts/:id" element={
                      <div className='main-container'>
                        <Menu />
                        <FullPost />
                        <QAZ />
                      </div>
                    } />
                    <Route path="/account/profile/:id?" element={
                      <div className='main-container'>
                        <Menu />
                        <Profile />
                        <QAZ />
                      </div>
                    } />
                    <Route path="/rev" element={
                      <div className='main-container'>
                        <Menu />
                        <MiniApps />
                        <QAZ />
                      </div>
                    } />
                    <Route path="/music" element={
                      <div className='main-container'>
                        <MenuMusic />
                        <Music />
                      </div>
                    } />
                    <Route path="/popularmusic" element={
                        <div className='main-container'>
                        <MenuMusic />
                        <PopularMusic />
                      </div>} />
                    <Route path="/artists" element={
                       <div className='main-container'>
                       <MenuMusic />
                       <ArtistList />
                     </div> 
                    } />
                    <Route path="/artist/:artistName" element={
                         <div className='main-container'>
                         <MenuMusic />
                         <ArtistPage />
                       </div> 
                    } />
                    {/* Добавляем ScrollFix только для страницы редактирования профиля */}
                    <Route path="/edit-profile/:id" element={
                      <ScrollFix>
                        <ProfileEdit />
                      </ScrollFix>
                    } />
                    <Route path="/tags/:tag" element={<TagsPage />} />
                  </Routes>
                </div>
              </>
            </PrivateRoute>
          } />
        </Routes>
      </SnackbarProvider>
    </div>
  );
};

// Добавляем компонент ScrollFix
const ScrollFix = ({ children }) => {
  useEffect(() => {
    // Принудительно разрешаем скролл при монтировании
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';

    return () => {
      // Очистка не требуется, так как мы хотим сохранить скролл
    };
  }, []);

  return children;
};

export default AppRouter;
