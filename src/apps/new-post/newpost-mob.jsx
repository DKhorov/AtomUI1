import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from '../../axios';
import './newpost-mon.scss';

const Newpostm = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLanguage] = useState('Markdown');
  const [title, setTitle] = useState('');
  const [postTags, setPostTags] = useState('');
  const [postText, setPostText] = useState(''); // Добавлено состояние для текста
  const [isLoading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ success: null, message: '' });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadStatus({ success: false, message: 'Допустимые форматы: JPEG, PNG, GIF' });
      return;
    }

    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadStatus({ success: false, message: `Максимальный размер файла: ${maxSizeMB}MB` });
      return;
    }

    setSelectedFile(file);
    setUploadStatus({ success: true, message: 'Файл успешно выбран' });
  };

  const handleSubmitPost = async () => {
    try {
      if (!title.trim() || !postTags.trim() || !postText.trim()) { // Добавлена проверка текста
        setModalMessage('Заполните все обязательные поля');
        setOpenModal(true);
        return;
      }

      const tagsArray = postTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      if (tagsArray.length === 0) {
        setModalMessage('Добавьте хотя бы один тег');
        setOpenModal(true);
        return;
      }

      setLoading(true);
      
      let imageUrl = '';
      if (selectedFile) {
        try {
          setUploadStatus({ success: null, message: 'Загрузка изображения...' });
          const formData = new FormData();
          formData.append('image', selectedFile);
          
          const { data } = await axios.post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });

          imageUrl = data.url;
          setUploadStatus({ success: true, message: 'Изображение успешно загружено' });
        } catch (err) {
          setUploadStatus({ 
            success: false, 
            message: err.response?.data?.error || 'Ошибка при загрузке изображения' 
          });
          return;
        }
      }

      // Добавлено поле text с содержимым textarea
      await axios.post('/posts', {
        title: title.trim(),
        description: 'Made in Phone ', // Пустое описание
        text: postText.trim(), // Текст из textarea
        tags: tagsArray,
        language: selectedLanguage,
        imageUrl: imageUrl || undefined
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      onClose();
    } catch (err) {
      setModalMessage(err.response?.data?.error || 'Ошибка при создании поста!');
      setOpenModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-m" onClick={onClose}>
      {openModal && (
        <div className="message-modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={() => setOpenModal(false)}>Закрыть</button>
          </div>
        </div>
      )}

      <div className="modal-content-m" onClick={(e) => e.stopPropagation()}>
        <h3 className='sddd'>Создать пост</h3>
        <input 
          className="m-p-input" 
          placeholder="Заголовок*" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input 
          className="m-p-input" 
          placeholder="Теги* (через запятую)"
          value={postTags}
          onChange={(e) => setPostTags(e.target.value)}
        />
        
        {/* Возвращена textarea */}
        <textarea 
          className="m-p-area" 
          placeholder="Текст поста (Markdown)"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>

        <div className="button-container-m">
          <label className="add-photo-btn-m">
            Добавить фото
            <input 
              type="file" 
              hidden 
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/gif"
            />
          </label>
          <button 
            className="submit-btn-m" 
            onClick={handleSubmitPost}
            disabled={isLoading}
          >
            {isLoading ? 'Отправка...' : 'Отправить'}
          </button>
        </div>

        {uploadStatus.message && (
          <div className={`upload-status ${uploadStatus.success === false ? 'error' : ''}`}>
            {uploadStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Newpostm;