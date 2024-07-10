import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import { MdLockOutline, MdMailOutline } from "react-icons/md";
import { toast } from "react-toastify";
import instance from "../../axios/axios";
import { TiArrowBackOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isSentMail, setIsSentMail] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sendEmail = await instance.post(`/auth/forgot-password`, {
        email: email,
      });
      if (sendEmail.data.status === "success") {
        toast.success(sendEmail.data.message, {
          autoClose: 500,
          theme: "colored",
        });
      } else {
        toast.error(sendEmail.data.message, {
          autoClose: 500,
          theme: "colored",
        });
        return;
      }
      setIsSentMail(true);
    } catch (error) {
      toast.error(error.response.data.msg, {
        autoClose: 500,
        theme: "colored",
      });
    }
  };

  return (
    <>
      {!isSentMail ? (
        <Container component="main" maxWidth="xs">
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
              Forgot Password
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      ) : (
        <Box
          sx={{
            marginTop: 28,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
          }}
        >
          <Typography
            component="h2"
            variant="h6"
            color="#1976d2"
            margin="20px 0"
          >
            Email Sent Successfully
          </Typography>
          <a
            href="https://mailtrap.io/inboxes/2542082/messages"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            <Button endIcon={<MdMailOutline />} variant="contained">
              Open Mail
            </Button>
          </a>
          <Button
            variant="contained"
            endIcon={<TiArrowBackOutline />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Box>
      )}
    </>
  );
};

export default ForgotPasswordForm;
