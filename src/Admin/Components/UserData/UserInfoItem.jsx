import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import styles from "../../../Pages/Update_User/Update.module.css";
import {
  AiFillCloseCircle,
  AiFillDelete,
  AiOutlineFileDone,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Transition } from "../../../Constants/Constant";
import instance from "../../../axios/axios";

const UserInfoItem = ({ commonGetRequest, id }) => {
  const [userData, setUserData] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: "",
    phoneNumber: "",
    email: "",
  });
  let navigate = useNavigate();
  useEffect(() => {
    commonGetRequest("/user", id, setUserData);
    window.scroll(0, 0);
  }, [commonGetRequest, userDetails, id]);

  useEffect(() => {
    const getUserData = async () => {
      const { data } = await instance.get(`/user/${id}`);
      if (data.status === "success") {
        userDetails.email = data.data.email;
        userDetails.username = data.data.username;
        userDetails.phoneNumber = data.data.phoneNumber;
      }
    };
    getUserData();
  }, [id, userDetails]);

  const handleOnchange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  let phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/gm;
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !userDetails.email &&
        !userDetails.phoneNumber &&
        !userDetails.username
      ) {
        toast.error("Please Fill the all Fields", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (userDetails.username.length < 3) {
        toast.error("Please enter name with more than 3 characters", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!emailRegex.test(userDetails.email)) {
        toast.error("Please enter valid email", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!phoneRegex.test(userDetails.phoneNumber)) {
        toast.error("Please enter a valid phone number", {
          autoClose: 500,
          theme: "colored",
        });
      } else {
        const { data } = await instance.put(`/user/${userData.id}`, {
          email: userDetails.email,
          phoneNumber: userDetails.phoneNumber,
          username: userDetails.username,
        });
        if (data.status === "success") {
          toast.success("Updated Successfully", {
            autoClose: 500,
            theme: "colored",
          });
        } else {
          toast.error("Something went wrong", {
            autoClose: 500,
            theme: "colored",
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data, { autoClose: 500, theme: "colored" });
    }
  };

  const deleteAccount = async () => {
    try {
      const deleteUser = await instance.delete(`/user/${userData.id}`);
      if (deleteUser.data.status === "success") {
        toast.success("Delete user successfully", {
          autoClose: 500,
          theme: "colored",
        });
        navigate(-1);
      }
    } catch (error) {
      toast.error(error.response.data, { autoClose: 500, theme: "colored" });
    }
  };

  return (
    <Container
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginBottom: 10,
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ margin: "20px 0" }}>
        User Details
      </Typography>
      <form
        noValidate
        autoComplete="off"
        className={styles.checkout_form}
        onSubmit={handleSubmit}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              name="username"
              value={userDetails.username || ""}
              onChange={handleOnchange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Number"
              name="phoneNumber"
              value={userDetails.phoneNumber || ""}
              onChange={handleOnchange}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={userDetails.email || ""}
              onChange={handleOnchange}
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: 5,
          }}
        >
          <Button
            variant="contained"
            endIcon={<AiOutlineFileDone />}
            type="submit"
          >
            Save
          </Button>
        </Container>
      </form>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          margin: "25px 0",
          width: "100%",
        }}
      >
        <Typography variant="h6">
          Delete {userData.username} 's Account?
        </Typography>
        <Button
          variant="contained"
          color="error"
          endIcon={<AiFillDelete />}
          onClick={() => setOpenAlert(true)}
        >
          Delete
        </Button>
      </Box>

      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenAlert(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
        <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
          <DialogContentText
            style={{ textAlign: "center" }}
            id="alert-dialog-slide-description"
          >
            <Typography variant="body1">
              {" "}
              {userData.username}'s all data will be erased
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            variant="contained"
            endIcon={<AiFillDelete />}
            color="error"
            onClick={deleteAccount}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenAlert(false)}
            endIcon={<AiFillCloseCircle />}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserInfoItem;
