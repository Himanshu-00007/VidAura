import React, { useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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

    axios
      .post("https://vidaura.onrender.com/api/v1/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 15000,
      })
      .then((res) => {
        console.log(res.data);
        navigate("/login");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, mt: 6 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create Account
        </Typography>

        <form onSubmit={submitHandler}>
          <Stack spacing={2}>
            {/* Full Name */}
            <TextField
              label="Full Name"
              variant="outlined"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              fullWidth
            />

            {/* Username */}
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />

            {/* Email */}
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />

            {/* Password */}
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            {/* Avatar Upload */}
            <Box textAlign="center">
              <Button variant="contained" component="label">
                Upload Avatar
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setAvatar(file);
                    setAvatarUrl(URL.createObjectURL(file));
                  }}
                />
              </Button>

              {avatarUrl && (
                <Avatar
                  src={avatarUrl}
                  sx={{ width: 70, height: 70, mt: 2, mx: "auto" }}
                />
              )}
            </Box>

            {/* Cover Image Upload */}
            <Box textAlign="center">
              <Button variant="outlined" component="label">
                Upload Cover Image
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setCoverImage(file);
                    setCoverImageUrl(URL.createObjectURL(file));
                  }}
                />
              </Button>

              {coverImageUrl && (
                <Avatar
                  src={coverImageUrl}
                  sx={{
                    width: 70,
                    height: 70,
                    mt: 2,
                    mx: "auto",
                    border: "2px solid #1976d2",
                  }}
                />
              )}
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ py: 1.2, fontSize: "16px", fontWeight: "bold" }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default SignIn;
