import React from 'react';
import image3 from './a.png';

const QAZ = () => {
  // Функция для определения мобильных устройств и планшетов
  const isMobileOrTablet = () => {
    // Строгая проверка user agent
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  // Если это мобильное устройство или планшет - не рендерим компонент
  if (isMobileOrTablet()) {
    return null;
  }

  return (
    <div className="ad-panel-mainm">
      <img src={image3} alt='Error AD :)' />
    </div>
  );
};

export default QAZ;