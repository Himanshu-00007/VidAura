import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new formData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    axios
      .post("https://vidaura.onrender.com/api/v1/users/login", formData)
      .then((res) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <div>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
        />
       </div>
       <div>
        <Input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        </div>
        <div>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        </div>
        <Button>Login</Button>
      </form>
    </>
  );
}

export default Login;
