import React, { useState, useEffect, useRef } from 'react';
import { 
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Badge,
  Drawer,
  useMediaQuery,
  SwipeableDrawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { Send, Menu, Close, Group, Wifi, PersonAdd } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import io from 'socket.io-client';
const PrivChat = () => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(true);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const messagesEndRef = useRef(null);
  const socket = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    socket.current = io('https://atomglidedev.ru', {
      auth: { token: localStorage.getItem('token') },
      reconnection: true,
      reconnectionAttempts: 5
    });

    socket.current.on('connect', () => {
      setIsSocketConnected(true);
      if (currentUser?._id) {
        socket.current.emit('userOnline', currentUser._id);
      }
    });

    socket.current.on('onlineUsersUpdate', (users) => {
      setOnlineUsers(users.map(u => u.userId._id));
    });

    socket.current.on('receivePrivateMessage', ({ chatId, message }) => {
      if (selectedChat?._id === chatId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    });

    socket.current.on('messageError', ({ tempId, error }) => {
      setMessages(prev => prev.filter(msg => msg.tempId !== tempId));
      setError(error);
      setIsSending(false);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [currentUser?._id, selectedChat?._id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, chatsRes] = await Promise.all([
          fetch('https://atomglidedev.ru/auth/me', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch('https://atomglidedev.ru/chats', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        const userData = await userRes.json();
        const chatsData = await chatsRes.json();

        setCurrentUser(userData);
        setChats(chatsData);
        
        if (isMobile) {
          setMobileOpen(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isMobile]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat) return;
      
      try {
        setLoading(true);
        const res = await fetch(`https://atomglidedev.ru/chats/${selectedChat._id}/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setMessages(data);
        scrollToBottom();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, [selectedChat]);


  const createNewChat = async () => {
    if (!newUserId.trim()) return;
    
    try {
      const response = await fetch('https://atomglidedev.ru/chats/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId: newUserId })
      });
      
      const data = await response.json();
      if (response.ok) {
        setChats(prev => [data, ...prev]);
        setNewChatOpen(false);
        setNewUserId('');
      } else {
        setError(data.error || 'Ошибка создания чата');
      }
    } catch (err) {
      setError('Ошибка сети');
    }
  }
  const sendMessage = async (e) => {
    e.preventDefault();
    const messageText = newMessage?.trim();
    if (!messageText) return;

    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newMsg = {
      _id: tempId,
      text: messageText,
      sender: currentUser._id,
      createdAt: new Date(),
      isOptimistic: true,
      tempId
    };

    setIsSending(true);
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    socket.current.emit('sendPrivateMessage', {
      chatId: selectedChat._id,
      text: messageText,
      tempId
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getParticipant = (chat) => {
    return chat?.participants?.find(p => p._id !== currentUser?._id);
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (loading && !selectedChat) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }


  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Диалог создания нового чата */}
      <Dialog open={newChatOpen} onClose={() => setNewChatOpen(false)}>
        <DialogTitle>Новый чат</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Введите ID пользователя для создания чата
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="ID пользователя"
            fullWidth
            variant="standard"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewChatOpen(false)}>Отмена</Button>
          <Button onClick={createNewChat} disabled={!newUserId.trim()}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Боковая панель с чатами */}
      <SwipeableDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        onOpen={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: 'background.paper',
            borderRight: '1px solid rgba(255, 255, 255, 0.12)'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Чаты</Typography>
          <Box>
            <IconButton onClick={() => setNewChatOpen(true)}>
              <PersonAdd />
            </IconButton>
            {isMobile && (
              <IconButton onClick={handleDrawerToggle}>
                <Close />
              </IconButton>
            )}
          </Box>
        </Box>
        <Divider />
        <List>
          {chats.map(chat => {
            const participant = getParticipant(chat);
            const isOnline = isUserOnline(participant?._id);

            return (
              <ListItem
                key={chat._id}
                button
                selected={selectedChat?._id === chat._id}
                onClick={() => {
                  setSelectedChat(chat);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)'
                  }
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color={isOnline ? "success" : "default"}
                  >
                    <Avatar src={participant?.avatarUrl} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={participant?.fullName}
                  secondary={formatDistanceToNow(new Date(chat.lastActivity), { 
                    addSuffix: true, 
                    locale: ru 
                  })}
                />
              </ListItem>
            );
          })}
        </List>
      </SwipeableDrawer>

      {/* Основная область чата */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          ml: isMobile ? 0 : '280px'
        }}
      >
        {selectedChat ? (
          <>
            {/* Шапка чата */}
            <Box 
              sx={{ 
                p: 2,
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                bgcolor: 'background.paper'
              }}
            >
              {isMobile && (
                <IconButton
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <Menu />
                </IconButton>
              )}
              <Box display="flex" alignItems="center">
                <Avatar 
                  src={getParticipant(selectedChat)?.avatarUrl} 
                  sx={{ mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {getParticipant(selectedChat)?.fullName}
                  </Typography>
                  <Typography variant="caption" display="flex" alignItems="center">
                    {isUserOnline(getParticipant(selectedChat)?._id) ? (
                      <>
                        <Wifi color="success" sx={{ fontSize: 16, mr: 0.5 }} />
                        онлайн
                      </>
                    ) : (
                      'офлайн'
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Область сообщений */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                p: 2,
                bgcolor: 'background.default'
              }}
            >
              {messages.map(msg => (
                <Box
                  key={msg._id}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.sender === currentUser?._id ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      bgcolor: msg.sender === currentUser?._id ? 'primary.main' : 'background.paper',
                      color: msg.sender === currentUser?._id ? 'primary.contrastText' : 'text.primary',
                      borderRadius: msg.sender === currentUser?._id ? 
                        '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      opacity: msg.isOptimistic ? 0.7 : 1
                    }}
                  >
                    <Typography>{msg.text}</Typography>
                    <Typography variant="caption" display="block" textAlign="right" mt={1}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Поле ввода сообщения */}
            <Box 
              component="form" 
              onSubmit={sendMessage}
              sx={{ 
                p: 2,
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                gap: 1,
                bgcolor: 'background.paper'
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Введите сообщение..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    bgcolor: 'rgba(255, 255, 255, 0.09)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.13)'
                    },
                    '&.Mui-focused': {
                      bgcolor: 'rgba(255, 255, 255, 0.13)',
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.5)'
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'rgba(255, 255, 255, 0.87)',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      opacity: 1
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ 
                  borderRadius: '50%',
                  minWidth: '56px',
                  height: '56px',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
                disabled={isSending || !newMessage.trim()}
              >
                {isSending ? <CircularProgress size={24} color="inherit" /> : <Send />}
              </Button>
            </Box>
          </>
        ) : (
          <Box 
            sx={{ 
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              p: 3
            }}
          >
            <Group sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              {chats.length === 0 ? 'У вас нет чатов' : 'Выберите чат'}
            </Typography>
          </Box>
        )}

        {/* Уведомления об ошибках */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default PrivChat;