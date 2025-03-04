'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Video {
  name: string;
  path: string;
}

export default function LofiPlayer() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
          if (data.length > 0) {
            setCurrentVideo(data[0]);
          }
        }
      } catch (error) {
        console.error('Error al cargar los videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoEnd = () => {
    const currentIndex = videos.findIndex(v => v.path === currentVideo?.path);
    const nextIndex = (currentIndex + 1) % videos.length;
    setCurrentVideo(videos[nextIndex]);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="animate-pulse">
          <div className="bg-red-100 h-48 rounded-lg mb-4"></div>
          <div className="h-4 bg-red-100 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-red-100 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-red-800 mb-4">Música LoFi</h2>
      
      {currentVideo ? (
        <div className="aspect-video rounded-lg overflow-hidden bg-black mb-4">
          <video
            src={currentVideo.path}
            className="w-full h-full object-cover"
            autoPlay
            controls
            onEnded={handleVideoEnd}
          />
        </div>
      ) : (
        <div className="aspect-video rounded-lg bg-red-50 flex items-center justify-center">
          <p className="text-red-800">No hay videos disponibles</p>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-medium text-red-800">Lista de reproducción:</h3>
        <div className="max-h-40 overflow-y-auto space-y-2">
          {videos.map((video, index) => (
            <button
              key={video.path}
              onClick={() => setCurrentVideo(video)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                currentVideo?.path === video.path
                  ? 'bg-red-100 text-red-800'
                  : 'hover:bg-red-50 text-gray-700'
              }`}
            >
              {index + 1}. {video.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 