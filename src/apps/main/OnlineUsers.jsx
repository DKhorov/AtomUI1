import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import '../../style/work/work.scss';

const OnlineUsers = () => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = [" NFT.", " simple.", " pure JS.", " pretty.", " fun!"];
  const period = 2000;

  useEffect(() => {
    let timer;
    const tick = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      let newText = isDeleting
        ? fullText.substring(0, displayText.length - 1)
        : fullText.substring(0, displayText.length + 1);

      setDisplayText(newText);

      let speed = typingSpeed;
      if (isDeleting) {
        speed /= 2;
      }

      if (!isDeleting && newText === fullText) {
        speed = period;
        setIsDeleting(true);
      } else if (isDeleting && newText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        speed = 500;
      }

      setTypingSpeed(speed);
      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, phrases, typingSpeed]);

  return (
    <div style={{
      fontFamily: "'Raleway', sans-serif",
      padding: '1em 2em',
      fontSize: '18px',
      color: '#aaa',
      height: '100%'
    }}>
      <link 
        href="https://fonts.googleapis.com/css?family=Raleway:200,100,400" 
        rel="stylesheet" 
        type="text/css" 
      />
      
      <Typography variant="h1" sx={{ 
        fontWeight: 200,
        margin: '0.4em 0',
        fontSize: '3.5rem',
        color: 'inherit'
      }}>
        AtomGlide 2.5 is
        <span style={{ 
          borderRight: '0.08em solid #666',
          paddingRight: '2px',
          marginLeft: '5px'
        }}>
          {displayText}
        </span>
      </Typography>
      
      <Typography variant="h2" sx={{ 
        fontWeight: 200,
        margin: '0.4em 0',
        fontSize: '2rem',
        color: '#888'
      }}>
        Нажми &lt; создать пост &gt; вверху страницы .
      </Typography>
    </div>
  );
};

export default OnlineUsers;
