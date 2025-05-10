// components/Artists/ArtistPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios';
import '../../style/work/work.scss';
import MusicItem from '../components/Music/MusicItem';
import MusicPlayer from '../components/Music/MusicPlayer';

const ArtistPage = () => {
  const { artistName } = useParams();
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/music');
        const filtered = data.filter(track => 
          track.artist === decodeURIComponent(artistName)
        );
        setArtist({
          name: decodeURIComponent(artistName),
          tracks: filtered,
          cover: filtered[0]?.coverImage || filtered[0]?.image || 'https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_960_720.png'
        });
        setTracks(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [artistName]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!artist) return <div>Исполнитель не найден</div>;

  return (
    <div className="artist-page">
      <div className="artist-header">
        <img 
          src={artist.cover} 
          alt={artist.name} 
          className="artist-cover" 
          onError={(e) => {
            e.target.src = 'https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256_960_720.png';
          }}
        />
        <div className="artist-info">
          <h1>{artist.name}</h1>
          <p className="stats">{artist.tracks.length} треков</p>
        </div>
      </div>

      <div className="tracks-list">
        <h2>Популярные треки</h2>
        {tracks.map(track => (
          <MusicItem 
            key={track._id} 
            item={track} 
            onPlay={handlePlay}
            isCurrent={currentTrack?._id === track._id}
            isPlaying={isPlaying && currentTrack?._id === track._id}
            showArtist={false}
          />
        ))}
      </div>

      {currentTrack && (
        <MusicPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
        />
      )}
    </div>
  );
};

export default ArtistPage;