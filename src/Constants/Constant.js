import { Slide } from "@mui/material";
import { forwardRef } from "react";
import instance from "../axios/axios";
const getCart = async (setProceed, setCart, userId) => {
  if (setProceed) {
    const { data } = await instance.get(`/cart/${userId}`);
    setCart(data.data);
  }
};

const getWishList = async (setProceed, setWishlistData, authToken) => {
  //   if (setProceed) {
  //     const { data } = await instance.get(
  //       `${process.env.REACT_APP_GET_WISHLIST}`
  //     );
  //     setWishlistData(data);
  //   }
};

const handleLogOut = (setProceed, toast, navigate, setOpenAlert) => {
  if (setProceed) {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("user");
    toast.success("Logout Successfully", { autoClose: 500, theme: "colored" });
    navigate("/");
    setOpenAlert(false);
  } else {
    toast.error("User is already logged of", {
      autoClose: 500,
      theme: "colored",
    });
  }
};

const handleClickOpen = (setOpenAlert) => {
  setOpenAlert(true);
};

const handleClose = (setOpenAlert) => {
  setOpenAlert(false);
};

const getAllProducts = async (setData) => {
  try {
    const { data } = await instance.get("/product");
    setData(data);
  } catch (error) {
    console.log(error);
  }
};

const getSingleProduct = async (setProduct, id, setLoading) => {
  const { data } = await instance.get(`/product/${id}`);
  setProduct(data);
  setLoading(false);
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export {
  getCart,
  getWishList,
  handleClickOpen,
  handleClose,
  handleLogOut,
  getAllProducts,
  getSingleProduct,
  Transition,
};
