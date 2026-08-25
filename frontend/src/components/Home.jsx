import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  // Fetch all videos on mount
  const allVideos = async () => {
    try {
      const res = await axios.get("https://vidaura-1.onrender.com/api/v1/videos/get-all-videos");
      setVideos(res.data.videos || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // Delete a video and update local state
  const deleteVideo = async (videoId) => {
    try {
      const token=localStorage.getItem("Tokens");
      await axios.delete(`https://vidaura-1.onrender.com/api/v1/videos/video-delete/${videoId}`,{
        withCredentials:true,
        headers:{
          Authorization:`Bearer ${token}`,
        }
      });
      setVideos((prev) => prev.filter((vid) => vid._id !== videoId));
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    allVideos();
  }, []);

  return (
    <div>
      <h2>Uploaded Videos ({videos.length})</h2>

      {/* Empty State vs. Video List */}
      {videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <div>
          {videos.map((vid) => (
            <div
              key={vid._id}
              onClick={() => setActiveVideo(vid)}
              style={{ cursor: 'pointer', border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}
            >
              <img
                src={vid.thumbnail}
                alt={vid.title}
                width="200"
              />
              <h3>{vid.title}</h3>
              <p>{vid.description}</p>
              <span>Duration: {Math.round(vid.duration || 0)}s</span>
              
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents opening modal when clicking delete
                    deleteVideo(vid._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()} // Prevents backdrop click from inside modal
            style={{ background: '#fff', padding: '20px', maxWidth: '600px', width: '100%' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>{activeVideo.title}</h3>
              <button onClick={() => setActiveVideo(null)}>Close</button>
            </div>

            <video
              src={activeVideo.videoFile}
              controls
              autoPlay
              style={{ width: '100%', marginTop: '10px' }}
            />
            
            <p>{activeVideo.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;