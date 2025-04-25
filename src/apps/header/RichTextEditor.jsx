
import './rich.css';
import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Tooltip, Chip } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  Code,
  FormatQuote,
  LooksOne,
  LooksTwo,
  Link as LinkIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

const ImagePreview = ({ url, onRemove }) => {
  return (
    <Box sx={{ 
      position: 'relative',
      display: 'inline-block',
      margin: '5px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      overflow: 'hidden',
      verticalAlign: 'bottom'
    }}>
      <img 
        src={`https://atomglidedev.ru${url}`} 
        alt="Preview" 
        style={{ 
          maxWidth: '200px',
          maxHeight: '150px',
          display: 'block'
        }}
      />
      <Chip
        label="×"
        onDelete={onRemove}
        color="error"
        size="small"
        sx={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          cursor: 'pointer',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white'
        }}
      />
    </Box>
  );
};

export const RichTextEditor = ({ value, onChange, onImageUpload }) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [content, setContent] = useState([]);
  const [cursorPos, setCursorPos] = useState(0);

  // Разбиваем содержимое на текст и изображения
  useEffect(() => {
    const parsedContent = [];
    let lastIndex = 0;
    const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
    let match;

    while ((match = imageRegex.exec(value)) !== null) {
      // Текст до изображения
      if (match.index > lastIndex) {
        parsedContent.push({
          type: 'text',
          value: value.substring(lastIndex, match.index)
        });
      }
      
      // Изображение
      parsedContent.push({
        type: 'image',
        url: match[2],
        description: match[1]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Остаток текста после последнего изображения
    if (lastIndex < value.length) {
      parsedContent.push({
        type: 'text',
        value: value.substring(lastIndex)
      });
    }

    setContent(parsedContent);
  }, [value]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    const newContent = content.map(item => 
      item.type === 'text' ? { ...item, value: newText } : item
    );
    
    // Обновляем Markdown
    updateMarkdown(newContent);
    setCursorPos(e.target.selectionStart);
  };

  const updateMarkdown = (contentArray) => {
    let markdown = '';
    contentArray.forEach(item => {
      if (item.type === 'text') {
        markdown += item.value;
      } else if (item.type === 'image') {
        markdown += `![${item.description}](${item.url})`;
      }
    });
    onChange(markdown);
  };

  const handleImageUpload = async (file) => {
    try {
      const imageUrl = await onImageUpload(file);
      if (imageUrl) {
        // Вставляем новое изображение в текущую позицию
        const newContent = [...content];
        const textParts = newContent.filter(item => item.type === 'text');
        
        if (textParts.length > 0) {
          const lastText = textParts[textParts.length - 1];
          const beforeCursor = lastText.value.substring(0, cursorPos);
          const afterCursor = lastText.value.substring(cursorPos);
          
          // Разбиваем текст на части
          const newItems = [];
          newContent.forEach(item => {
            if (item.type === 'text') {
              if (item.value === lastText.value) {
                newItems.push({ type: 'text', value: beforeCursor });
                newItems.push({ 
                  type: 'image', 
                  url: imageUrl, 
                  description: 'image' 
                });
                newItems.push({ type: 'text', value: afterCursor });
              } else {
                newItems.push(item);
              }
            } else {
              newItems.push(item);
            }
          });
          
          setContent(newItems);
          updateMarkdown(newItems);
        } else {
          // Если нет текста, просто добавляем изображение
          const newItems = [...content, { 
            type: 'image', 
            url: imageUrl, 
            description: 'image' 
          }];
          setContent(newItems);
          updateMarkdown(newItems);
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки изображения:', err);
    }
  };

  const removeImage = (index) => {
    const newContent = content.filter((_, i) => i !== index);
    setContent(newContent);
    updateMarkdown(newContent);
  };

  const handleFormat = (prefix, suffix = '', placeholder = '') => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    const newText = selectedText 
      ? prefix + selectedText + suffix
      : prefix + placeholder + suffix;
    
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    const updatedValue = beforeText + newText + afterText;
    
    // Находим текстовый элемент и обновляем его
    const newContent = content.map(item => 
      item.type === 'text' ? { ...item, value: updatedValue } : item
    );
    
    setContent(newContent);
    updateMarkdown(newContent);
    
    // Обновляем позицию курсора
    setTimeout(() => {
      textarea.selectionStart = start + newText.length;
      textarea.selectionEnd = start + newText.length;
      textarea.focus();
    }, 0);
  };

  return (
    <Box sx={{ border: '1px solid #4a4a6a', borderRadius: '4px', padding: '10px' }}>
      {/* Панель инструментов */}
      <Box sx={{ display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <Tooltip title="Жирный">
          <IconButton size="small" onClick={() => handleFormat('**', '**')}>
            <FormatBold fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Курсив">
          <IconButton size="small" onClick={() => handleFormat('_', '_')}>
            <FormatItalic fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Заголовок 1">
          <IconButton size="small" onClick={() => handleFormat('# ', '')}>
            <LooksOne fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Заголовок 2">
          <IconButton size="small" onClick={() => handleFormat('## ', '')}>
            <LooksTwo fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Маркированный список">
          <IconButton size="small" onClick={() => handleFormat('- ', '')}>
            <FormatListBulleted fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Нумерованный список">
          <IconButton size="small" onClick={() => handleFormat('1. ', '')}>
            <FormatListNumbered fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Код">
          <IconButton size="small" onClick={() => handleFormat('`', '`')}>
            <Code fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Цитата">
          <IconButton size="small" onClick={() => handleFormat('> ', '')}>
            <FormatQuote fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Ссылка">
          <IconButton size="small" onClick={() => handleFormat('[', '](url)')}>
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Изображение">
          <IconButton 
            size="small"
            onClick={() => fileInputRef.current.click()}
          >
            <ImageIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleImageUpload(e.target.files[0]);
            }
            e.target.value = ''; // Сбрасываем значение для повторного выбора того же файла
          }}
        />
      </Box>

      {/* Редактор с изображениями */}
      <Box
        ref={editorRef}
        contentEditable
        sx={{
          minHeight: '200px',
          padding: '10px',
          border: '1px solid #4a4a6a',
          borderRadius: '4px',
          backgroundColor: '#2a2a3e',
          color: 'white',
          outline: 'none',
          '&:focus': {
            borderColor: '#4cc9f0'
          }
        }}
        onInput={(e) => {
          const text = e.target.textContent;
          const textItems = content.filter(item => item.type === 'text');
          if (textItems.length > 0) {
            const newContent = content.map(item => 
              item.type === 'text' ? { ...item, value: text } : item
            );
            setContent(newContent);
            updateMarkdown(newContent);
          }
        }}
        onBlur={(e) => {
          setCursorPos(window.getSelection().getRangeAt(0).startOffset);
        }}
      >
        {content.map((item, index) => {
          if (item.type === 'text') {
            return item.value;
          } else if (item.type === 'image') {
            return (
              <ImagePreview 
                key={`img-${index}`}
                url={item.url}
                onRemove={() => removeImage(index)}
              />
            );
          }
          return null;
        })}
      </Box>
    </Box>
  );
};