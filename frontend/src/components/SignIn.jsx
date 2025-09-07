import React from 'react'
import { useState } from 'react'
import axios from "axios";

function SignIn() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    axios.post("https://vidaura.onrender.com/api/v1/users/register", formData)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input type="text" onChange={(e) => setFullname(e.target.value)} value={fullname} placeholder="enter fullname" required />
        <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} placeholder="enter username" required />
        <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="enter email" required />
        <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="enter password" required />
        <input type="file" onChange={(e) => { const file = e.target.files[0]; setAvatar(file); setAvatarUrl(URL.createObjectURL(file)); }}  required />
        {avatarUrl && <img src={avatarUrl} alt="avatar preview" />}
        <input type="file" onChange={(e) => { const file = e.target.files[0]; setCoverImage(file); setCoverImageUrl(URL.createObjectURL(file)); }} required />
        { coverImageUrl && <img src={coverImageUrl} alt="cover preview" />}
        <button type="submit">
          {loading && <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>}
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignIn;
