import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../../redux/slices/posts';
import axios from '../../axios';
import './newpost.scss';

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#',
  'C++', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
  'Rust', 'Dart', 'Markdown', 'Other'
];

const Newpost = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [title, setTitle] = useState('');
  const [postTags, setPostTags] = useState('');
  const [description, setDescription] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ success: null, message: '' });
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) loadDrafts();
  }, [isOpen]);

  const loadDrafts = () => {
    setLoadingDrafts(true);
    setTimeout(() => {
      try {
        const savedDrafts = JSON.parse(localStorage.getItem('codeDrafts')) || [];
        setDrafts(savedDrafts);
      } catch (error) {
        console.error('Error loading drafts:', error);
      } finally {
        setLoadingDrafts(false);
      }
    }, 500);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    if (selectedDraft?.code) {
      editor.setValue(selectedDraft.code);
    } else {
      editor.setValue('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Проверка типа файла
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadStatus({ success: false, message: 'Допустимые форматы: JPEG, PNG, GIF' });
      return;
    }

    // Проверка размера файла (10MB)
    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadStatus({ success: false, message: `Максимальный размер файла: ${maxSizeMB}MB` });
      return;
    }

    setSelectedFile(file);
    setUploadStatus({ success: true, message: 'Файл успешно выбран' });
  };

  const handleSaveDraft = () => {
    const codeContent = editorRef.current?.getValue() || '';
    const newDraft = {
      id: Date.now(),
      title,
      postTags,
      description,
      language: selectedLanguage,
      code: codeContent,
      file: selectedFile?.name || null,
      createdAt: new Date().toISOString()
    };

    const updatedDrafts = [...drafts, newDraft];
    localStorage.setItem('codeDrafts', JSON.stringify(updatedDrafts));
    setDrafts(updatedDrafts);
    alert('Черновик сохранен!');
  };

  const handleSubmitPost = async () => {
    try {
      if (!title.trim() || !description.trim() || !postTags.trim()) {
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
      const codeContent = editorRef.current?.getValue() || '';
  
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
  
          if (data.error) throw new Error(data.error);
          
          imageUrl = data.url;
          setUploadStatus({ success: true, message: 'Изображение успешно загружено' });
        } catch (err) {
          console.error('Ошибка загрузки изображения:', err);
          setUploadStatus({ 
            success: false, 
            message: err.response?.data?.error || 'Ошибка при загрузке изображения' 
          });
          return;
        }
      }
  
      const postData = {
        title: title.trim(),
        description: description.trim(),
        text: codeContent,
        tags: tagsArray,
        language: selectedLanguage,
        imageUrl: imageUrl || undefined
      };
  
      await axios.post('/posts', postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Сброс формы
      setTitle('');
      setPostTags('');
      setDescription('');
      setSelectedFile(null);
      setSelectedLanguage('JavaScript');
      setUploadStatus({ success: null, message: '' });
      if (editorRef.current) editorRef.current.setValue('');
      dispatch(fetchPosts());
      onClose();
    } catch (err) {
      console.warn(err);
      setModalMessage(err.response?.data?.error || 'Ошибка при создании поста!');
      setOpenModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {openModal && (
        <div className="message-modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={() => setOpenModal(false)}>Закрыть</button>
          </div>
        </div>
      )}

      <div className="modal-content-щ" onClick={(e) => e.stopPropagation()}>
        <div className="modal-flex-container">
          <div className="modal-box1">
            <input
              className="modal-input"
              placeholder="Заголовок*"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />
            <input
              className="modal-input"
              placeholder="Описание* (максимум 200 символов)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
            />
            <input
              className="modal-input"
              placeholder="Теги* (через запятую)"
              value={postTags}
              onChange={(e) => setPostTags(e.target.value)}
            />

            <select
              className="language-selector"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            <div className="file-upload-container">
              <label className="file-upload-label">
                <div className="upload-icon">
                  <svg viewBox="0 0 24 24" width="48" height="48">
                    <path fill="#888" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </div>
                <h2>Фото поста</h2>
                <h4>Поддержка jpeg,png,gif</h4>
                <input 
                  type="file" 
                  className="file-input" 
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png, image/gif" 
                />
              </label>
              
              {/* Статус загрузки файла */}
              {uploadStatus.message && (
                <div className={`upload-status ${uploadStatus.success === false ? 'error' : ''}`}>
                  {uploadStatus.message}
                </div>
              )}
              
              {selectedFile && (
                <div className="file-preview">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>

            <div className="drafts-section">
              <h3>Мои черновики</h3>
              {loadingDrafts ? (
                <div className="draft-loading">
                  <div className="spinner"></div>
                </div>
              ) : drafts.length === 0 ? (
                <div className="no-drafts">Нет черновиков</div>
              ) : (
                <ul className="drafts-list">
                  {drafts.map(draft => (
                    <li 
                      key={draft.id}
                      className={`draft-item ${selectedDraft?.id === draft.id ? 'active' : ''}`}
                      onClick={() => setSelectedDraft(draft)}
                    >
                      <div className="draft-info">
                        <h4>{draft.title || 'Без названия'}</h4>
                        <div className="draft-meta">
                          <span>{new Date(draft.createdAt).toLocaleDateString()}</span>
                          <span>{draft.language}</span>
                        </div>
                      </div>
                      <button 
                        className="delete-draft-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrafts(drafts.filter(d => d.id !== draft.id));
                        }}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="modal-box2" ref={containerRef}>
            <Editor
              height="100%"
              language={selectedLanguage.toLowerCase()}
              theme="vs-dark"
              onMount={handleEditorDidMount}
              value={selectedDraft?.code || ''}
              options={{
                automaticLayout: true,
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                minimap: { enabled: false }
              }}
              loading={<div style={{ color: '#fff' }}>Загрузка редактора...</div>}
            />
          </div>
        </div>

        <div className="action-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Отменить
          </button>
          <button 
            className="draft-btn" 
            onClick={handleSaveDraft}
            disabled={loadingDrafts}
          >
            Сохранить черновик
          </button>
          <button 
            className="submit-btnl" 
            onClick={handleSubmitPost}
            disabled={isLoading || (uploadStatus.success === false)}
          >
            {isLoading ? 'Публикация...' : 'Опубликовать'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Newpost;