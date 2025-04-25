import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../../redux/slices/posts';
import { selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Box
} from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import { RichTextEditor } from './RichTextEditor';

export const CreatePostModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data.url;
    } catch (err) {
      console.error('Ошибка загрузки изображения:', err);
      throw err;
    }
  };

  const onSubmit = async () => {
    if (!title.trim()) {
      alert('Пожалуйста, введите заголовок поста');
      return;
    }
  
    try {
      setLoading(true);
  
      const fields = {
        title,
        tags: tags.trim() ? tags.split(',').map(tag => tag.trim()) : [],
        text: content.trim(),
      };
  
      await axios.post('/posts', fields);
      dispatch(fetchPosts());
      onClose();
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании поста!');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuth) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#1e1e2e',
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #4a4a6a'
      }}>
        Создать новый пост
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ paddingTop: '20px !important' }}>
        <Box sx={{ marginBottom: 3 }}>
          <TextField
            fullWidth
            label="Заголовок поста"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ 
              marginBottom: 2,
              '& .MuiInputBase-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#4a4a6a' },
                '&:hover fieldset': { borderColor: '#4cc9f0' },
              },
              '& .MuiInputLabel-root': { 
                color: '#a0a0a0',
                '&.Mui-focused': { color: '#4cc9f0' }
              }
            }}
          />
          
          <TextField
            fullWidth
            label="Теги (через запятую)"
            variant="outlined"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            sx={{ 
              marginBottom: 2,
              '& .MuiInputBase-root': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#4a4a6a' },
                '&:hover fieldset': { borderColor: '#4cc9f0' },
              },
              '& .MuiInputLabel-root': { 
                color: '#a0a0a0',
                '&.Mui-focused': { color: '#4cc9f0' }
              }
            }}
          />
          
          <RichTextEditor 
            value={content}
            onChange={setContent}
            onImageUpload={handleImageUpload}
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        padding: '16px 24px', 
        borderTop: '1px solid #4a4a6a',
        justifyContent: 'space-between'
      }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: 'white', 
            '&:hover': { 
              backgroundColor: 'rgba(255,255,255,0.1)' 
            } 
          }}
        >
          Отмена
        </Button>
        <Button 
          onClick={onSubmit} 
          variant="contained" 
          sx={{
            backgroundColor: '#4cc9f0',
            color: '#1a1a2e',
            '&:hover': { 
              backgroundColor: '#3aa8d8',
            },
            '&:disabled': {
              backgroundColor: '#4a4a6a',
              color: '#7a7a8a'
            }
          }}
          disabled={isLoading || !title.trim()}
          endIcon={isLoading ? <CircularProgress size={20} sx={{ color: '#1a1a2e' }} /> : <Send />}
        >
          Опубликовать
        </Button>
      </DialogActions>
    </Dialog>
  );
};