import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './apps/header/header';
import Menu from './apps/menu/Menu';
import Work from './apps/main/work';
import { FullPost } from './apps/fullpost/FullPost';
import { Mobile } from './apps/menu/menu-mob';
import Dock from "./apps/menu/dock";
import Profile from './account/account';
import Chat from './apps/tools/chat';
import Code from './code/index';
import Wallet from './apps/wallet/wallet';
import Store from './apps/store/store';

import Priv from './apps/tools/priv';
import { SnackbarProvider } from 'notistack';
import Login from "./apps/setup/Login";
import RegistrationForm from "./apps/setup/Registration";
import { fetchAuthMe } from "./redux/slices/auth";
import { useDispatch } from 'react-redux';
import AdminPanel from './apps/tools/admin';
import ProfileEdit from './apps/edit-account/edit';
import MiniApps from './apps/mini-apps/mini-apps'; // Импортируем компонент MiniApps
import {TagsPage} from './apps/mini-apps/TagsPage'; // Импортируем компонент MiniApps

import SurveyForm from './apps/mini-apps/application/form';
import FileEditor from './apps/mini-apps/application/code';

const AppRouter = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = React.useState(false);

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

  return (
    <div className="app-container">
      <SnackbarProvider maxSnack={3}>
      <Routes>
        {/* Маршруты без хедера */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dock" element={<Dock />} />
        <Route path="/apps/atomform" element={<SurveyForm />} />
        <Route path="/apps/thecode" element={<FileEditor />} />
        <Route path="/priv" element={<Priv />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/code" element={<Code />} />




        {/* Маршруты с хедером */}
        <Route 
          path="/*" 
          element={
            <>
              <Header />
              
              

              {isMobile && <Mobile />}
              <Routes>
                <Route
                  path="/"
                  element={
                    <div >
                      <Menu />
                      <Work />
                    </div>
                  }
                  
                />
                <Route
                  path="/mini-apps"
                  element={
                    <div >
                      <Menu />
                      <MiniApps />
                    </div>
                  }
                />
                <Route path="/wallet" element={<div >
                  <Menu />
                  <Wallet />
                </div>} />

                
                <Route path="/posts/:id" element={<FullPost />} />
                <Route path="/account/profile/:id?" element={<Profile />} />
                <Route path="/edit-profile/:id" element={<ProfileEdit />} />
                <Route path="/store" element={<Store />} />
                <Route path="/tags/:tag" element={<TagsPage />} />
              </Routes>
            </>
          } 
        />
      </Routes></SnackbarProvider>
    </div>
  );
};

export default AppRouter;