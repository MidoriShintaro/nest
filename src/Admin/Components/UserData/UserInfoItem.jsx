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
import { AiFillCloseCircle, AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Transition } from "../../../Constants/Constant";
import instance from "../../../axios/axios";

const UserInfoItem = ({ commonGetRequest, id }) => {
  const [userData, setUserData] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);

  let navigate = useNavigate();
  useEffect(() => {
    commonGetRequest("/user", id, setUserData);
    window.scroll(0, 0);
  }, [commonGetRequest, id]);

  const deleteAccount = async () => {
    try {
      const deleteUser = await instance.delete(`/user/${userData.id}`);
      toast.success(deleteUser.data.message, {
        autoClose: 500,
        theme: "colored",
      });
      navigate(-1);
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            inputProps={{ readOnly: true }}
            label="Username"
            name="username"
            value={userData.username || ""}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            inputProps={{ readOnly: true }}
            label="Contact Number"
            type="tel"
            name="phoneNumber"
            value={userData.phoneNumber || ""}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            inputProps={{ readOnly: true }}
            label="Email"
            name="userEmail"
            value={userData.email || ""}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            inputProps={{ readOnly: true }}
            label="Address"
            name="address"
            value={userData.address || ""}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            inputProps={{ readOnly: true }}
            label="City"
            name="city"
            value={userData.city || ""}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            inputProps={{ readOnly: true }}
            type="tel"
            label="Postal/Zip Code"
            name="zipCode"
            value={userData.zipCode || ""}
            variant="outlined"
            fullWidth
          />
        </Grid>
        {/* <Grid item xs={12}>
          <TextField
            inputProps={{ readOnly: true }}
            label="Province/State"
            name="userState"
            value={userData.userState || ""}
            variant="outlined"
            fullWidth
          />
        </Grid> */}
      </Grid>

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
