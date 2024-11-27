import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { MdOutlineCancel, MdPersonAddAlt1 } from "react-icons/md";
import { toast } from "react-toastify";
import { Transition } from "../../Constants/Constant";
import instance from "../../axios/axios";

const AddUser = ({ getUser }) => {
  const [open, setOpen] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
  });
  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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
        !credentials.phoneNumber &&
        !credentials.role
      ) {
        toast.error("Please Fill the all Fields", {
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
        credentials.password &&
        credentials.role
      ) {
        const sendAuth = await instance.post(`/user`, {
          username: credentials.username,
          email: credentials.email,
          phoneNumber: credentials.phoneNumber,
          password: credentials.password,
          role: credentials.role,
        });
        const receive = await sendAuth.data;
        setOpen(false);
        if (receive.status === "success") {
          getUser();
          toast.success(receive.data, {
            autoClose: 500,
            theme: "colored",
          });
          setCredentials({
            username: "",
            email: "",
            phoneNumber: "",
            password: "",
            role: "",
          });
        } else {
          toast.error(receive.message.response.message[0], {
            autoClose: 500,
            theme: "colored",
          });
        }
      }
    } catch (error) {
      toast.error(error.response.data.error, {
        autoClose: 500,
        theme: "colored",
      });
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        <Typography
          variant="h6"
          textAlign="center"
          color="#1976d2"
          fontWeight="bold"
        >
          Add new user
        </Typography>
        <Button
          variant="contained"
          endIcon={<MdPersonAddAlt1 />}
          onClick={handleClickOpen}
        >
          Add
        </Button>
      </Box>
      <Divider sx={{ mb: 5 }} />
      <Dialog
        open={open}
        onClose={handleClose}
        keepMounted
        TransitionComponent={Transition}
      >
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "bold", color: "#1976d2" }}
        >
          {" "}
          Add new user
        </DialogTitle>
        <DialogContent>
          <Box onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
                  type="password"
                  value={credentials.password}
                  onChange={handleOnChange}
                  id="password"
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
                      value="USER"
                      control={<Radio />}
                      onChange={handleOnChange}
                      label="USER"
                      name="role"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={handleClose}
                endIcon={<MdOutlineCancel />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                fullWidth
                variant="contained"
                endIcon={<MdPersonAddAlt1 />}
              >
                Add
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddUser;
