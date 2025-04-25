import React, { useRef, useState } from 'react';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Fullscreen from '@mui/icons-material/Fullscreen';
import Send from '@mui/icons-material/Send';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';
import FormatListNumbered from '@mui/icons-material/FormatListNumbered';
import CodeIcon from '@mui/icons-material/Code';
import FormatQuote from '@mui/icons-material/FormatQuote';
import FormatHeader1 from '@mui/icons-material/LooksOne';
import FormatHeader2 from '@mui/icons-material/LooksTwo';
import ReactMarkdown from 'react-markdown';
import axios from '../../axios';

export const PostCreationPanel = ({
  title,
  setTitle,
  text,
  setText,
  postTags,
  setPostTags,
  imageUrl,
  setImageUrl,
  isLoading,
  onSubmit,
  showTextArea,
  setShowTextArea,
  showTagsInput,
  setShowTagsInput,
  showImageUpload,
  setShowImageUpload,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputFileRef = useRef(null);
  const textareaRef = useRef(null);

  const insertMarkdown = (prefix, suffix = '', placeholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    let newText;
    let newCursorPos;

    if (selectedText) {
      newText = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;
      newCursorPos = start + prefix.length + selectedText.length + suffix.length;
    } else {
      newText = `${beforeText}${prefix}${placeholder}${suffix}${afterText}`;
      newCursorPos = start + prefix.length + (placeholder ? placeholder.length : 0);
    }

    setText(newText);
    
    setTimeout(() => {
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
      textarea.focus();
    }, 0);
  };

  const formatBold = () => insertMarkdown('**', '**', 'жирный текст');
  const formatItalic = () => insertMarkdown('_', '_', 'курсив');
  const formatHeader1 = () => insertMarkdown('# ', '', 'Заголовок 1');
  const formatHeader2 = () => insertMarkdown('## ', '', 'Заголовок 2');
  const formatList = () => insertMarkdown('- ', '', 'элемент списка');
  const formatNumberedList = () => insertMarkdown('1. ', '', 'элемент списка');
  const formatCode = () => insertMarkdown('`', '`', 'код');
  const formatCodeBlock = () => insertMarkdown('```\n', '\n```', 'код');
  const formatQuote = () => insertMarkdown('> ', '', 'цитата');

  const handleFileClick = () => {
    setShowTextArea(!showTextArea);
    setShowTagsInput(false);
    setShowImageUpload(false);
  };

  const handlePhotoClick = () => {
    setShowImageUpload(!showImageUpload);
    setShowTextArea(false);
    setShowTagsInput(false);
  };

  const handleTagsClick = () => {
    setShowTagsInput(!showTagsInput);
    setShowTextArea(!showTextArea);
    setShowImageUpload(false);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Допустимые форматы: JPG, PNG, GIF, WebP');
      }

      const maxSize = 20 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`Файл слишком большой (макс. ${maxSize/1024/1024}MB)`);
      }

      setUploadProgress(0);

      const formData = new FormData();
      formData.append('image', file);

      const { data } = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (!data.url) throw new Error('URL изображения не получен от сервера');
      setImageUrl(data.url);
    } catch (err) {
      console.error('Ошибка при загрузке файла:', err);
      setImageUrl('');
    } finally {
      setUploadProgress(0);
    }
  };

  const handleChangeFile = async (event) => {
    if (event.target.files && event.target.files[0]) {
      await handleFileUpload(event.target.files[0]);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChangeText = (e) => {
    setText(e.target.value);
  };

  return (
    <div className={`DS1 animate-fade-in ${(showTextArea || showTagsInput || showImageUpload) ? 'expanded' : ''}`}>
      <h1 className='YHN'>Добавить пост</h1>
      <input
        type="text"
        className="post-title-input"
        placeholder="Напиши заголовок поста"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      {showTagsInput && (
        <input
          type="text"
          className="tags-input"
          placeholder="Сюда один тэг"
          value={postTags}
          onChange={(e) => setPostTags(e.target.value)}
        />
      )}
      {showTextArea && (
        <div className="markdown-editor">
          <div className="markdown-toolbar">
            <button onClick={formatBold} title="Жирный"><FormatBold /></button>
            <button onClick={formatItalic} title="Курсив"><FormatItalic /></button>
            <button onClick={formatHeader1} title="Заголовок 1"><FormatHeader1 /></button>
            <button onClick={formatHeader2} title="Заголовок 2"><FormatHeader2 /></button>
            <button onClick={formatList} title="Маркированный список"><FormatListBulleted /></button>
            <button onClick={formatNumberedList} title="Нумерованный список"><FormatListNumbered /></button>
            <button onClick={formatCode} title="Код"><CodeIcon /></button>
            <button onClick={formatCodeBlock} title="Блок кода"><CodeIcon /></button>
            <button onClick={formatQuote} title="Цитата"><FormatQuote /></button>
          </div>
          <textarea
            ref={textareaRef}
            className="post-textarea"
            placeholder="Сюда текст поста (поддерживается Markdown)..."
            value={text}
            onChange={onChangeText}
            rows={8}
          />
          <div className="markdown-preview">
            <h4>Предпросмотр:</h4>
            <ReactMarkdown>{text || '*Начните вводить текст...*'}</ReactMarkdown>
          </div>
        </div>
      )}
      
      {showImageUpload && (
        <div 
          className={`image-upload ${isDragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !imageUrl && inputFileRef.current.click()}
        >
          {!imageUrl ? (
            <div className="upload-area">
              <PhotoCamera style={{ 
                fontSize: 50, 
                color: isDragging ? '#4a96f3' : '#a0a0a0',
                transition: 'color 0.3s ease'
              }} />
              <p className="upload-text">
                {isDragging ? 'Отпустите для загрузки' : 'Перетащите изображение сюда или нажмите для выбора'}
              </p>
              {uploadProgress > 0 && (
                <div className="upload-progress">
                  <div className="progress-bar" style={{ width: `${uploadProgress}%` }} />
                  <span>{uploadProgress}%</span>
                </div>
              )}
              <input 
                ref={inputFileRef} 
                type="file" 
                onChange={handleChangeFile} 
                hidden 
                accept="image/*,.png,.jpg,.jpeg,.gif,.webp" 
              />
            </div>
          ) : (
            <div className="image-preview-container">
              <button 
                className="remove-image-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClickRemoveImage();
                }}
              >
                Удалить
              </button>
              <img 
                src={`https://atomglidedev.ru${imageUrl}`} 
                alt="Uploaded preview" 
                className="preview-image"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-image.png';
                }}
              />
            </div>
          )}
        </div>
      )}
      
      <div className="tab-s">
        <div className="icon-buttons">
          <button 
            className={`icon-button ${showImageUpload ? 'active' : ''}`} 
            title="Фото"
            onClick={handlePhotoClick}
          >
            <PhotoCamera />
          </button>
    
          <button 
            className={`icon-button ${showTagsInput ? 'active' : ''}`} 
            title="Теги"
            onClick={handleTagsClick}
          >
            <Fullscreen />
          </button>
        </div>
        <button 
          className="icon-button send-button" 
          title="Отправить"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? '...' : <Send />}
        </button>
      </div>
    </div>
  );
};