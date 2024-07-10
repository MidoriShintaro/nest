import "../Login/login.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { MdLockOutline } from "react-icons/md";
import { Box, Container } from "@mui/system";
import { toast } from "react-toastify";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

import instance from "../../../axios/axios";

const AdminRegister = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    let auth = localStorage.getItem("Authorization");
    if (auth) {
      navigate("/");
    }
  }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/gm;
    let emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    try {
      if (
        !credentials.email &&
        !credentials.username &&
        !credentials.password &&
        !credentials.phoneNumber
      ) {
        toast.error("All fields are required", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (credentials.username.length <= 3) {
        toast.error("Please enter name with more than 3 characters", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!emailRegex.test(credentials.email)) {
        toast.error("Please enter valid email", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!phoneRegex.test(credentials.phoneNumber)) {
        toast.error("Please enter a valid phone number", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (credentials.password.length < 5) {
        toast.error("Please enter password with more than 5 characters", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (
        credentials.email &&
        credentials.username &&
        credentials.phoneNumber &&
        credentials.password
      ) {
        const sendAuth = await instance.post("/auth/register", {
          email: credentials.email,
          username: credentials.username,
          phoneNumber: credentials.phoneNumber,
          password: credentials.password,
          role: credentials.role,
        });
        const receive = await sendAuth.data;
        if (receive.status === "success") {
          toast.success("Registered Successfully", {
            autoClose: 500,
            theme: "colored",
          });
          navigate("/admin/login");
          return;
        } else {
          toast.error(receive.message, {
            autoClose: 500,
            theme: "colored",
          });
          return;
        }
      }
    } catch (error) {
      toast.error("Invalid Credentials", { autoClose: 500, theme: "colored" });
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs" sx={{ marginBottom: 10 }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#1976d2" }}>
            <MdLockOutline />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={credentials.username}
                  onChange={handleOnChange}
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={credentials.email}
                  onChange={handleOnChange}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Contact Number"
                  name="phoneNumber"
                  value={credentials.phoneNumber}
                  onChange={handleOnChange}
                  inputMode="numeric"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  value={credentials.password}
                  onChange={handleOnChange}
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        onClick={handleClickShowPassword}
                        sx={{ cursor: "pointer" }}
                      >
                        {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                      </InputAdornment>
                    ),
                  }}
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Role
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="ADMIN"
                    value={credentials.role}
                    name="role"
                  >
                    <FormControlLabel
                      value="ADMIN"
                      control={<Radio />}
                      onChange={handleOnChange}
                      label="ADMIN"
                      name="role"
                    />
                    <FormControlLabel
                      value="MODERATOR"
                      name="role"
                      control={<Radio />}
                      onChange={handleOnChange}
                      label="MODERATOR"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                Already have an account?
                <Link
                  to="/admin/login"
                  style={{ color: "#1976d2", marginLeft: 3 }}
                >
                  Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AdminRegister;
