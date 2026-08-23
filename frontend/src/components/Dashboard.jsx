import Button from "@mui/material/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const token = localStorage.getItem("Tokens");
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const res = await axios.get(
          "https://vidaura-1.onrender.com/api/v1/videos/get-user-videos",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVideos(res.data.videos || []);
      } catch (error) {
        console.error("error fetching dadhboard videos", error);
      }
    };
    fetchUserVideos();
  }, [token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!title || !description || !videoFile || !thumbnail) {
      alert("please provide all fields and files");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);
    try {
      const res = await axios.post(
        "https://vidaura-1.onrender.com/api/v1/videos/video-upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(
        "video uploading error",
        error.response?.data || error.message
      );
    }
  };

  const logoutHandler = async () => {
    try {
      console.log(token);
      await axios.post(
        "https://vidaura-1.onrender.com/api/v1/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("logout error", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              VidAura
            </span>
          </div>
          <Button
            onClick={logoutHandler}
            variant="outlined"
            size="small"
            sx={{
              color: "#f87171",
              borderColor: "#7f1d1d",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "0.5rem",
              "&:hover": {
                borderColor: "#ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
              },
            }}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Upload Form Section */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-100">
              Upload New Content
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Share your video and custom thumbnail with your audience.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Video Title
                </label>
                <input
                  type="text"
                  value={title}
                  placeholder="Enter a compelling title..."
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition duration-150"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  placeholder="What is this video about?"
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition duration-150"
                />
              </div>
            </div>

            {/* File Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Video File
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/10 file:text-indigo-400 hover:file:bg-indigo-600/20 file:cursor-pointer border border-slate-700/60 rounded-xl p-1.5 bg-slate-800/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600/10 file:text-purple-400 hover:file:bg-purple-600/20 file:cursor-pointer border border-slate-700/60 rounded-xl p-1.5 bg-slate-800/30"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  borderRadius: "0.75rem",
                  padding: "0.65rem 1.75rem",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  },
                }}
              >
                Upload Video
              </Button>
            </div>
          </form>
        </section>

        {/* Uploaded Videos Grid Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100">
              Your Uploaded Videos
            </h2>
            <span className="text-xs font-medium px-2.5 py-1 bg-slate-800 text-slate-400 rounded-full border border-slate-700">
              {videos.length} {videos.length === 1 ? "video" : "videos"}
            </span>
          </div>

          {videos.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-400 font-medium">No videos uploaded yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Upload your first video above to see it listed here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((vid) => (
                <div
                  key={vid._id}
                  className="group bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-slate-200 text-xs px-2 py-0.5 rounded-md font-mono">
                      {Math.round(vid.duration || 0)}s
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-100 text-base line-clamp-1 group-hover:text-indigo-400 transition">
                        {vid.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;