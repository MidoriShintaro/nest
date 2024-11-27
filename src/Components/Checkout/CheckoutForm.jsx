import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./Chekout.module.css";
import { BsFillCartCheckFill } from "react-icons/bs";
import { MdUpdate } from "react-icons/md";
import { ContextFunction } from "../../Context/Context";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Transition, handleClose } from "../../Constants/Constant";
import { AiFillCloseCircle, AiOutlineSave } from "react-icons/ai";
import instance from "../../axios/axios";
import axios from "axios";
import OrderSummary from "../../Pages/Cart/OrderSummary";

const CheckoutForm = () => {
  const { cart } = useContext(ContextFunction);
  // const [userData, setUserData] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [district, setDistrict] = useState([]);
  const [province, setProvince] = useState([]);
  const [ward, setWard] = useState([]);
  const amount = sessionStorage.getItem("totalAmount");
  const [shippingCoast, setShippingCoast] = useState(0);
  const totalAmount = Number(amount) + Number(shippingCoast);

  const getProvince = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_URL_ADDRESS}/province`,
      { headers: { token: process.env.REACT_APP_TOKEN_URL } }
    );
    if (response.data.code === 200) {
      setProvince(response.data.data);
    }
  };

  const getDistrict = async () => {
    if (userDetails.province) {
      const response = await axios.get(
        `${process.env.REACT_APP_URL_ADDRESS}/district?province_id=${userDetails.province}`,
        { headers: { token: process.env.REACT_APP_TOKEN_URL } }
      );
      if (response.data.code === 200) {
        setDistrict(response.data.data);
      }
    }
  };

  const getWard = async () => {
    if (userDetails.district) {
      const response = await axios.get(
        `${process.env.REACT_APP_URL_ADDRESS}/ward?district_id=${userDetails.district}`,
        { headers: { token: process.env.REACT_APP_TOKEN_URL } }
      );
      if (response.data.code === 200) {
        setWard(response.data.data);
      }
    }
  };

  const getShipping = async () => {
    if (userDetails.province && userDetails.district && userDetails.ward) {
      const response = await axios.get(
        `${process.env.REACT_APP_URL_SHIPPING}?service_type_id=2&insurance_value=${amount}&to_ward_code=${userDetails.ward}&to_district_id=${userDetails.district}&from_district_id=1461&weight=100`,
        {
          headers: {
            token: process.env.REACT_APP_TOKEN_URL,
            shop_id: process.env.REACT_APP_SHOP_ID,
          },
        }
      );
      console.log(response);
      if (response.data.code === 200) {
        setShippingCoast(response.data.data.total);
        localStorage.setItem("shipping", response.data.data.total);
      }
    }
  };

  let authToken = localStorage.getItem("Authorization");
  const user = localStorage.getItem("user");
  let setProceed = authToken ? true : false;
  let navigate = useNavigate();
  // let totalAmount = sessionStorage.getItem("totalAmount");
  const [userDetails, setUserDetails] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    province: "",
    ward: "",
    district: "",
    address: "",
  });

  useEffect(() => {
    if (setProceed) {
      const getUserData = async () => {
        try {
          const { data } = await instance.get(`/user/${user}`);
          // setUserData(data.data);
          if (!data.data.email || !data.data.username) {
            setOpenAlert(true);
          }
          userDetails.username = data.data.username;
          userDetails.email = data.data.email;
          userDetails.phoneNumber = data.data.phoneNumber;
        } catch (error) {
          console.log(error);
        }
      };
      getUserData();
      getProvince();
      getDistrict();
      getWard();
      getShipping();
    } else {
      navigate("/");
    }
  }, [navigate, setProceed, user, userDetails]);

  const checkOutHandler = async (e) => {
    e.preventDefault();
    if (
      !userDetails.username ||
      !userDetails.email ||
      !userDetails.address ||
      !userDetails.province ||
      !userDetails.district ||
      !userDetails.ward
    ) {
      toast.error("Please fill all fields", {
        autoClose: 500,
        theme: "colored",
      });
    } else {
      try {
        const districtData = district.find(
          (d) => d.DistrictID === userDetails.district
        );
        const wardData = ward.find((w) => w.WardCode === userDetails.ward);
        const provinceData = province.find(
          (p) => p.ProvinceID === userDetails.province
        );
        const data = {
          cartIds: cart.map((c) => c.id),
          user,
          address: `${userDetails.address}, ${wardData.WardName}, ${districtData.DistrictName}, ${provinceData.NameExtension[1]}`,
        };
        const response = await instance.post("/order", data);
        const redirect = await instance.get(
          `/zalopay/create?amount=${totalAmount}&username=${userDetails.username}&app_trans_id=${response.data.data.orderCode}`
        );
        window.location.href = redirect.data.data.order_url;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleOnchange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  return (
    <>
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
        <Typography variant="h6" sx={{ margin: "20px 0" }}>
          Checkout
        </Typography>
        <form
          noValidate
          autoComplete="off"
          className={styles.checkout_form}
          onSubmit={checkOutHandler}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                inputProps={{ readOnly: true }}
                disabled
                label="First Name"
                name="firstName"
                value={userDetails.username || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                inputProps={{ readOnly: true }}
                disabled
                label="Contact Number"
                type="tel"
                name="phoneNumber"
                value={userDetails.phoneNumber || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                inputProps={{ readOnly: true }}
                disabled
                label="Email"
                name="userEmail"
                value={userDetails.email || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel id="Province">Province</InputLabel>
              <Select
                label="Province"
                name="province"
                value={userDetails.province || ""}
                onChange={handleOnchange}
                labelId="Province"
                variant="outlined"
                fullWidth
              >
                {province.map((pr) => {
                  return (
                    <MenuItem value={pr.ProvinceID}>{pr.ProvinceName}</MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="District">District</InputLabel>
              <Select
                label="District"
                name="district"
                value={userDetails.district || ""}
                onChange={handleOnchange}
                labelId="District"
                variant="outlined"
                fullWidth
              >
                {district.map((d) => {
                  return (
                    <MenuItem value={d.DistrictID}>{d.DistrictName}</MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="Ward">Ward</InputLabel>
              <Select
                label="Ward"
                name="ward"
                value={userDetails.ward || ""}
                onChange={handleOnchange}
                labelId="Ward"
                variant="outlined"
                fullWidth
              >
                {ward.map((w) => {
                  return <MenuItem value={w.WardCode}>{w.WardName}</MenuItem>;
                })}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={userDetails.address || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Container
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <OrderSummary
              total={amount}
              shippingCoast={shippingCoast}
              isCheckoutForm={true}
            />
          </Container>

          <Container
            sx={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              marginTop: 5,
            }}
          >
            <Link to="/update">
              {" "}
              <Button variant="contained" endIcon={<MdUpdate />}>
                Update
              </Button>
            </Link>
            <Button
              variant="contained"
              endIcon={<BsFillCartCheckFill />}
              type="submit"
            >
              Checkout
            </Button>
          </Container>
        </form>

        <Dialog
          open={openAlert}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => handleClose(setOpenAlert)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent
            sx={{
              width: { xs: 280, md: 350, xl: 400 },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6">
              Add permanent address then you don't have to add again.{" "}
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Link to="/update">
              {" "}
              <Button
                variant="contained"
                endIcon={<AiOutlineSave />}
                color="primary"
              >
                Add
              </Button>
            </Link>
            <Button
              variant="contained"
              color="error"
              endIcon={<AiFillCloseCircle />}
              onClick={() => handleClose(setOpenAlert)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default CheckoutForm;
