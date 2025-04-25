import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const FollowingPanel = ({ userData, isMounted }) => {
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`panel-ch animate-fade-right ${isMounted ? 'delay-2' : ''}`}>
      <div className="ch1">
        <h1 className='K-LOP'>Ваши подписки</h1>
        
        {userData?.subscriptions?.length > 0 ? (
          <div className="following-list">
            {userData.subscriptions.map(user => (
              <div 
                key={user._id} 
                className="following-user"
                onClick={() => navigate(`/account/profile/${user._id}`)}
              >
                <Avatar
                  className="following-avatar"
                  src={user.avatarUrl ? `https://atomglidedev.ru${user.avatarUrl}` : '../../image/1.png'}
                  alt={user.fullName}
                  sx={{
                    width: 40,
                    height: 40,
                    fontSize: 16,
                    bgcolor: '#1976d2'
                  }}
                  imgProps={{
                    onError: (e) => {
                      e.target.onerror = null;
                      e.target.src = '../../image/1.png';
                    }
                  }}
                >
                  {!user.avatarUrl && getInitials(user.fullName)}
                </Avatar>
                
                <div className="following-info">
                  <span className="following-name">
                    {user.fullName}
                    {user.verified === 'verified' && (
                      <CheckCircleIcon 
                        className="verified-badge" 
                        sx={{ 
                          fontSize: 16,
                          color: '#1976d2',
                          ml: 0.5
                        }}
                      />
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-following-message">
            {userData ? 'Вы пока ни на кого не подписаны' : 'Загрузка...'}
          </p>
        )}
      </div>
    </div>
  );
};