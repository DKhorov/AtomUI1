import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
  Grid,
  Paper,
  styled,
  Fade,
  Slide,
  Grow,
  Zoom
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import BugReportIcon from '@mui/icons-material/BugReport';
import GroupIcon from '@mui/icons-material/Group';
import GavelIcon from '@mui/icons-material/Gavel';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { keyframes } from '@emotion/react';

// Анимации
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Цветовая схема
const colors = {
  primary: '#9147ff',
  secondary: '#772ce8',
  background: '#0d1117',
  card: '#161b22',
  text: '#c9d1d9',
  accent: '#58a6ff'
};

// Стилизованные компоненты
const FeatureBanner = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
  borderRadius: '8px',
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)'
  }
}));

const CodeBlock = styled(Box)(({ theme }) => ({
  backgroundColor: colors.card,
  padding: theme.spacing(2),
  borderRadius: '8px',
  overflowX: 'auto',
  fontFamily: 'monospace',
  margin: theme.spacing(2, 0),
  borderLeft: `4px solid ${colors.accent}`
}));

const FloatingBox = styled(Box)({
  animation: `${floatAnimation} 3s ease-in-out infinite`
});

const PulsingBox = styled(Box)({
  animation: `${pulseAnimation} 2s ease-in-out infinite`
});

// Компонент бегущей строки
const RunningText = ({ text }) => {
  return (
    <Box sx={{
      width: '100%',
      overflow: 'hidden',
      bgcolor: colors.primary,
      py: 1,
      mb: 3,
      borderRadius: '4px'
    }}>
      <Box sx={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        animation: `${keyframes`
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        `} 15s linear infinite`,
        color: 'white',
        fontWeight: 'bold'
      }}>
        {Array(5).fill(text).join(' ••• ')}
      </Box>
    </Box>
  );
};

// Основной компонент
function Dock() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [welcomeVisible, setWelcomeVisible] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setWelcomeVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Упрощенное меню
  const menuSections = [
    { id: 'about', text: 'О сервисе', icon: <RocketLaunchIcon /> },
    { id: 'features', text: 'Возможности', icon: <CodeIcon /> },
    { id: 'quick-start', text: 'Быстрый старт', icon: <RocketLaunchIcon /> },
    { id: 'api', text: 'API', icon: <LinkIcon /> },
    { id: 'social', text: 'Соцсети', icon: <GroupIcon /> },
    { id: 'if-not-work', text: 'Если не работает', icon: <BugReportIcon /> },
    { id: 'thanks', text: 'Благодарности', icon: <GavelIcon /> }
  ];

  // Боковое меню (JSX внутри переменной)
  const drawer = (
    <Box sx={{ 
      width: 260, 
      height: '100vh', 
      bgcolor: colors.background,
      borderRight: `1px solid ${colors.card}`
    }}>
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${colors.card}`,
        textAlign: 'center'
      }}>
        <Typography variant="h5" sx={{ 
          color: colors.primary,
          fontWeight: 'bold',
          mb: 1
        }}>
          AtomGlide
        </Typography>
        <Typography variant="body2" sx={{ 
          color: colors.text,
          opacity: 0.8
        }}>
          Документация v2.0
        </Typography>
      </Box>
      
      <List sx={{ p: 2 }}>
        {menuSections.map((item) => (
          <ListItem 
            key={item.id} 
            disablePadding
            sx={{
              mb: 1,
              borderRadius: '8px',
              bgcolor: activeSection === item.id ? 'rgba(145, 71, 255, 0.2)' : 'transparent',
              borderLeft: activeSection === item.id ? `3px solid ${colors.primary}` : 'none'
            }}
          >
            <ListItemButton 
              onClick={() => handleSectionChange(item.id)}
              sx={{
                py: 1.5,
                px: 2
              }}
            >
              <Box sx={{ 
                color: activeSection === item.id ? colors.primary : colors.text,
                mr: 2
              }}>
                {item.icon}
              </Box>
              <ListItemText 
                primary={item.text} 
                sx={{
                  '& .MuiTypography-root': {
                    color: activeSection === item.id ? colors.primary : colors.text,
                    fontWeight: activeSection === item.id ? '600' : '400'
                  }
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

// Основное содержимое
const renderContent = () => {
switch (activeSection) {
case 'about':
return (
<Box>
<RunningText text="🚀 Добро пожаловать в документацию AtomGlide — платформы для разработчиков будущего!" />

        <Fade in={welcomeVisible} timeout={1000} unmountOnExit>
          <Box sx={{
            bgcolor: colors.primary,
            color: 'white',
            p: 3,
            mb: 3,
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <Typography variant="h5">Добро пожаловать в Dock!</Typography>
            <Typography>Исследуйте возможности нашей платформы</Typography>
          </Box>
        </Fade>
        
        <Typography variant="h4" gutterBottom sx={{ 
          color: colors.primary, 
          pb: 2,
          borderBottom: `1px solid ${colors.card}`
        }}>
          О платформе AtomGlide
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography paragraph sx={{ color: colors.text }}>
              AtomGlide — это современная платформа для разработчиков, сочетающая инструменты для работы с кодом и социальные функции.
            </Typography>
            
            <PulsingBox>
              <Card sx={{ bgcolor: colors.card, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: colors.primary }}>
                    Почему AtomGlide?
                  </Typography>
                  <ul style={{ color: colors.text, paddingLeft: '20px' }}>
                    <li>Интуитивный интерфейс</li>
                    <li>Мощные инструменты для работы с кодом</li>
                    <li>Сообщество разработчиков</li>
                    <li>Постоянные обновления</li>
                  </ul>
                </CardContent>
              </Card>
            </PulsingBox>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FloatingBox>
              <img 
                src="https://via.placeholder.com/500x300/161b22/9147ff?text=AtomGlide+Demo" 
                alt="AtomGlide Demo" 
                style={{ 
                  width: '100%', 
                  borderRadius: '8px',
                  border: `1px solid ${colors.card}`
                }} 
              />
            </FloatingBox>
          </Grid>
        </Grid>
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FeatureBanner>
              <CodeIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Работа с кодом</Typography>
                <Typography variant="body2">
                  • Публикация сниппетов с подсветкой<br />
                  • Совместное редактирование<br />
                  • 50+ языков программирования
                </Typography>
              </Box>
            </FeatureBanner>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FeatureBanner>
              <GroupIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Социальные функции</Typography>
                <Typography variant="body2">
                  • Приватные и групповые чаты<br />
                  • Комментарии к коду<br />
                  • Система рейтинга
                </Typography>
              </Box>
            </FeatureBanner>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FeatureBanner>
              <AddAPhotoIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Развлечения</Typography>
                <Typography variant="body2">
                  • IT-мемы и гифки<br />
                  • Игровые боты в чатах<br />
                  • Виртуальные комнаты
                </Typography>
              </Box>
            </FeatureBanner>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FeatureBanner>
              <RocketLaunchIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Технологии</Typography>
                <Typography variant="body2">
                  • Реактивный интерфейс<br />
                  • API для интеграций<br />
                  • Поддержка IDE
                </Typography>
              </Box>
            </FeatureBanner>
          </Grid>
        </Grid>
      </Box>
    );
  
  case 'features':
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ 
          color: colors.primary, 
          pb: 2,
          borderBottom: `1px solid ${colors.card}`
        }}>
          Основные возможности
        </Typography>
        
        <Grid container spacing={3}>
          {[
            {
              icon: <CodeIcon color="primary" sx={{ fontSize: 30 }} />,
              title: "Работа с кодом",
              items: [
                "Подсветка синтаксиса",
                "Версионность сниппетов",
                "Поиск по коду",
                "Экспорт в Gist"
              ]
            },
            {
              icon: <GroupIcon color="primary" sx={{ fontSize: 30 }} />,
              title: "Социальные",
              items: [
                "Комментарии к коду",
                "Рейтинг разработчиков",
                "Группы по интересам",
                "Система менторства"
              ]
            },
            {
              icon: <LinkIcon color="primary" sx={{ fontSize: 30 }} />,
              title: "Интеграции",
              items: [
                "GitHub/GitLab",
                "VS Code плагин",
                "CI/CD инструменты",
                "REST API"
              ]
            },
            {
              icon: <BugReportIcon color="primary" sx={{ fontSize: 30 }} />,
              title: "Отладка",
              items: [
                "Песочница для кода",
                "Совместная отладка",
                "История ошибок",
                "База решений"
              ]
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Grow in timeout={500 + index * 200}>
                <Card sx={{ 
                  bgcolor: colors.card,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {feature.icon}
                      <Typography variant="h6" sx={{ 
                        color: colors.primary,
                        ml: 1
                      }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <ul style={{ 
                      paddingLeft: '20px', 
                      margin: 0,
                      color: colors.text
                    }}>
                      {feature.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  
  case 'quick-start':
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ 
          color: colors.primary, 
          pb: 2,
          borderBottom: `1px solid ${colors.card}`
        }}>
          Быстрый старт
        </Typography>
        
        <Typography paragraph sx={{ color: colors.text }}>
          Начните работу с AtomGlide за 3 простых шага:
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ 
            color: colors.primary,
            mb: 2
          }}>
            1. Установка CLI
          </Typography>
          <CodeBlock>
            npm install -g atomglide-cli
          </CodeBlock>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ 
            color: colors.primary,
            mb: 2
          }}>
            2. Настройка проекта
          </Typography>
          <CodeBlock>
            atomglide init
          </CodeBlock>
          <Typography variant="body2" sx={{ 
            color: colors.text,
            mt: 1,
            opacity: 0.8
          }}>
            Следуйте инструкциям мастера настройки
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="h5" sx={{ 
            color: colors.primary,
            mb: 2
          }}>
            3. Запуск
          </Typography>
          <CodeBlock>
            atomglide start
          </CodeBlock>
          <Typography variant="body2" sx={{ 
            color: colors.text,
            mt: 1,
            opacity: 0.8
          }}>
            Откройте http://localhost:3000 в браузере
          </Typography>
        </Box>
      </Box>
    );
  
  case 'social':
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ 
          color: colors.primary, 
          pb: 2,
          borderBottom: `1px solid ${colors.card}`
        }}>
          Наши соцсети
        </Typography>
        
        <Typography paragraph sx={{ color: colors.text, mb: 3 }}>
          Присоединяйтесь к нашему сообществу в социальных сетях:
        </Typography>
        
        <Grid container spacing={3}>
          {[
            {
              icon: <TelegramIcon sx={{ color: '#0088cc', fontSize: 40 }} />,
              name: "Telegram",
              description: "Официальный канал с анонсами и обсуждениями",
              link: "https://t.me/atomglide"
            },
            {
              icon: <TwitterIcon sx={{ color: '#1DA1F2', fontSize: 40 }} />,
              name: "Twitter",
              description: "Новости и обновления платформы",
              link: "https://twitter.com/atomglide"
            },
            {
              icon: <GitHubIcon sx={{ color: colors.text, fontSize: 40 }} />,
              name: "GitHub",
              description: "Исходный код и issue tracker",
              link: "https://github.com/atomglide"
            },
            {
              icon: <YouTubeIcon sx={{ color: '#FF0000', fontSize: 40 }} />,
              name: "YouTube",
              description: "Обучающие видео и туториалы",
              link: "https://youtube.com/atomglide"
            }
          ].map((social, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Slide direction="up" in timeout={500 + index * 200}>
                <Card sx={{ 
                  bgcolor: colors.card,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 3 }}>
                      {social.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: colors.primary }}>
                        {social.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text, mb: 1 }}>
                        {social.description}
                      </Typography>
                      <Typography 
                        component="a" 
                        href={social.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ 
                          color: colors.accent,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        Перейти →
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  
  case 'if-not-work': // Новый раздел вместо 'contribute'
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ 
          color: colors.primary, 
          pb: 2,
          borderBottom: `1px solid ${colors.card}`
        }}>
          Решение распространенных проблем
        </Typography>

        {/* Проблема с фото */}
        <Card sx={{ bgcolor: colors.card, mb: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: colors.primary, mb: 1 }}>
              Не грузит фото
            </Typography>
            <Typography sx={{ color: colors.text }}>
              Данная проблема возникает из-за задержки загрузки ресурсов:
            </Typography>
            <ul style={{ color: colors.text, paddingLeft: '20px' }}>
              <li>Перезагрузите страницу (Ctrl + F5)</li>
              <li>Проверьте подключение к интернету</li>
              <li>Убедитесь, что пост содержит изображение</li>
            </ul>
          </CardContent>
        </Card>

        {/* Проблема с постами */}
        <Card sx={{ bgcolor: colors.card, mb: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: colors.primary, mb: 1 }}>
              Не грузятся посты
            </Typography>
            <Typography sx={{ color: colors.text }}>
              Возможные решения:
            </Typography>
            <ul style={{ color: colors.text, paddingLeft: '20px' }}>
              <li>Проверьте статус сервера в Telegram-канале</li>
              <li>Обновите страницу через 2-3 минуты</li>
              <li>Очистите кеш браузера</li>
              <li>Если посты пропали — обратитесь в поддержку</li>
            </ul>
          </CardContent>
        </Card>

        {/* Проблема с профилем */}
        <Card sx={{ bgcolor: colors.card, mb: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: colors.primary, mb: 1 }}>
              Ошибка в профиле
            </Typography>
            <Typography sx={{ color: colors.text }}>
              После регистрации:
            </Typography>
            <ul style={{ color: colors.text, paddingLeft: '20px' }}>
              <li>Дождитесь завершения инициализации аккаунта (до 5 мин)</li>
              <li>Перезагрузите страницу</li>
              <li>Если проблема сохраняется — войдите повторно</li>
            </ul>
          </CardContent>
        </Card>

        {/* Проблема с лайками */}
        <Card sx={{ bgcolor: colors.card, mb: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: colors.primary, mb: 1 }}>
              Ошибка при лайке
            </Typography>
            <Typography sx={{ color: colors.text }}>
              Что можно сделать:
            </Typography>
            <ul style={{ color: colors.text, paddingLeft: '20px' }}>
              <li>Проверьте статус сайта</li>
              <li>Обновите интерфейс (F5)</li>
              <li>Убедитесь, что не нажали кнопку дважды</li>
            </ul>
          </CardContent>
        </Card>

        {/* Проблема с комментариями */}
        <Card sx={{ bgcolor: colors.card, mb: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: colors.primary, mb: 1 }}>
              Нельзя ответить на свой комментарий
            </Typography>
            <Typography sx={{ color: colors.text }}>
              Это ограничение системы:
            </Typography>
            <ul style={{ color: colors.text, paddingLeft: '20px' }}>
              <li>Ответы на свои комментарии временно отключены</li>
              <li>Функция появится в следующих обновлениях</li>
            </ul>
          </CardContent>
        </Card>

        {/* Проблема с интерфейсом */}
        <Card sx={{ bgcolor: colors.card }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: colors.primary, mb: 1 }}>
              Лаги на мобильных устройствах
            </Typography>
            <Typography sx={{ color: colors.text }}>
              Рекомендации:
            </Typography>
            <ul style={{ color: colors.text, paddingLeft: '20px' }}>
              <li>Используйте десктопную версию</li>
              <li>Обновите браузер до последней версии</li>
              <li>Активируйте "Версию для ПК" в настройках браузера</li>
            </ul>
          </CardContent>
        </Card>
      </Box>
    );

  case 'thanks': // Обновленный раздел благодарностей
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ 
          color: colors.primary, 
          pb: 2,
          borderBottom: `1px solid ${colors.card}`
        }}>
          Благодарности
        </Typography>

        <Grid container spacing={3}>
          {[
            {
              name: "Dmitry Khorov",
              role: "Fullstack разработчик (Frontend, Backend, SEO)",
              contribution: "Архитектура платформы, основная разработка"
            },
            {
              name: "Anna Petrova",
              role: "UI/UX дизайнер",
              contribution: "Дизайн системы и анимации"
            },
            {
              name: "Maxim Volkov",
              role: "DevOps инженер",
              contribution: "Настройка инфраструктуры"
            },
            {
              name: "Elena Smirnova",
              role: "Тестировщик",
              contribution: "Контроль качества и баг-фиксинг"
            },
            {
              name: "Community",
              role: "Пользователи платформы",
              contribution: "Идеи и обратная связь"
            }
          ].map((person, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Zoom in timeout={500 + index * 200}>
                <Card sx={{ bgcolor: colors.card }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: colors.primary }}>
                      {person.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text, mt: 1 }}>
                      {person.role}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: colors.text,
                      opacity: 0.8,
                      mt: 1
                    }}>
                      {person.contribution}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  
  default:
    return (
      <Box>
        <Typography variant="h4" sx={{ color: colors.primary }}>
          Раздел в разработке
        </Typography>
        <Typography sx={{ color: colors.text, mt: 2 }}>
          Этот раздел документации пока не готов. Попробуйте другие разделы меню.
        </Typography>
      </Box>
    );
}
};

return (
<Box sx={{
display: 'flex',
bgcolor: colors.background,
minHeight: '100vh',
color: colors.text
}}>
{/* Кнопка меню для мобильных */}
<IconButton
color="inherit"
aria-label="open drawer"
edge="start"
onClick={handleDrawerToggle}
sx={{
position: 'fixed',
top: 16,
left: 16,
zIndex: theme.zIndex.drawer + 1,
display: { xs: 'block', md: 'none' },
color: colors.text
}}
>
<MenuIcon />
</IconButton>

  {/* Боковое меню */}
  <Box
    component="nav"
    sx={{ 
      width: { md: 260 },
      flexShrink: { md: 0 }
    }}
  >
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box',
          width: 260,
          bgcolor: colors.background,
          borderRight: `1px solid ${colors.card}`
        },
      }}
    >
      {drawer}
    </Drawer>
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': { 
          boxSizing: 'border-box',
          width: 260,
          bgcolor: colors.background,
          borderRight: `1px solid ${colors.card}`
        },
      }}
      open
    >
      {drawer}
    </Drawer>
  </Box>
  
  {/* Основное содержимое */}
  <Box
    component="main"
    sx={{ 
      flexGrow: 1,
      p: 3,
      width: { md: `calc(100% - 260px)` },
      maxWidth: 1200,
      margin: '0 auto'
    }}
  >
    <Box sx={{ 
      pt: { xs: 6, md: 3 },
      pb: 3
    }}>
      {renderContent()}
    </Box>
  </Box>
</Box>
);
}

export default Dock;