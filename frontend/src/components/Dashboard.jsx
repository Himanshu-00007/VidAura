import Button from "@mui/material/Button";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



function Dashboard() {
    const token=localStorage.getItem("Tokens");
    const navigate=useNavigate();
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [videoFile,setVideoFile]=useState(null);
    const [thumbnail,setThumbnail]=useState(null);

    const submitHandler=async(e)=>{
      e.preventDefault();
      if(!title || !thumbnail || !videoFile || !thumbnail){
        alert("please provide all fields and files");
        return;
      }
      const formData=new FormData();
      formData.append("title",title);
      formData.append("description",description);
      formData.append("videoFile",videoFile);
      formData.append("thumbnail",thumbnail);
      try{
        const res=await axios.post("https://vidaura-1.onrender.com/api/v1/videos/video-upload",formData,{
          headers:{
            Authorization:`Bearer ${token}`
          },
          withCredentials:true,
        })
        console.log(res.data);
      }
      catch(error){
        console.log("video uploading error",error.response?.data || error.message);
      }
    }

    const logoutHandler=async()=>{
      try{
        
        console.log(token);
        await axios.post(
        "https://vidaura-1.onrender.com/api/v1/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
        },
          withCredentials: true,
      });
      
        localStorage.clear();
        navigate("/login");
      }
      catch(error){
        console.error("logout error",error.response?.data || error.message);
      }
        


    }
  return (
    <div>
      <>
        <div className="navbar">
          <Button onClick={logoutHandler}>Logout</Button>
        </div>
        <div>
          <form onSubmit={submitHandler}>
            <input type="text" value={title} placeholder="title" onChange={(e)=>{setTitle(e.target.value)}}/>
            <input type="text" value={description} placeholder="description" onChange={(e)=>{setDescription(e.target.value)}}/>
            <input type="file" placeholder="video" onChange={(e)=>{setVideoFile(e.target.files[0])}}/>
            <input type="file" placeholder="thumbnail" onChange={(e)=>{setThumbnail(e.target.files[0])}}/>
            <Button type="submit" >upload video</Button>
          </form>
          
        </div>

      

        
      </>
    </div>
  );
}

export default Dashboard;
