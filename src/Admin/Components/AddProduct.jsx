import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import { Transition } from "../../Constants/Constant";
import { MdOutlineCancel, MdProductionQuantityLimits } from "react-icons/md";
import instance from "../../axios/axios";

const AddProduct = ({ getProductInfo, data }) => {
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [productInfo, setProductInfo] = useState({
    productName: "",
    image: "",
    price: "",
    size: "",
    categoryName: "",
    color: "",
    description: "",
    brand: "",
  });
  const handleOnchange = (e) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUploadImage = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setProductInfo({ image: e.target.files[0] });
    }
  };

  const category = ["suitcase", "backpack", "handbag", "accessory"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !productInfo.productName &&
        !productInfo.image &&
        !productInfo.price &&
        !productInfo.color &&
        !productInfo.category &&
        !productInfo.brand &&
        !productInfo.size &&
        !productInfo.description
      ) {
        toast.error("Please Fill the all Fields", {
          autoClose: 500,
          theme: "colored",
        });
        return;
      } else {
        const formData = new FormData();
        formData.append("productName", productInfo.productName);
        formData.append("image", productInfo.image);
        formData.append("price", productInfo.price);
        formData.append("color", productInfo.color);
        formData.append("categoryName", productInfo.categoryName);
        formData.append("size", productInfo.size);
        formData.append("description", productInfo.description);
        formData.append("brand", productInfo.brand);
        const { data } = await instance.post(`/product`, formData);
        if (data.status === "success") {
          toast.success("Product added successfully", {
            autoClose: 500,
            theme: "colored",
          });
          getProductInfo();
          setOpen(false);
          setProductInfo({
            productName: "",
            image: "",
            price: "",
            color: "",
            categoryName: "",
            size: "",
            description: "",
            brand: "",
          });
        } else {
          toast.error("Some thing went wrong", {
            autoClose: 500,
            theme: "colored",
          });
          return;
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
          Add new product{" "}
        </Typography>
        <Button
          variant="contained"
          endIcon={<MdProductionQuantityLimits />}
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
          Add new product
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Product Name"
                    name="productName"
                    value={productInfo.productName}
                    onChange={handleOnchange}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Product Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={productInfo.categoryName}
                      label="Product Category"
                      name="categoryName"
                      onChange={handleOnchange}
                    >
                      {category.map((item) => (
                        <MenuItem value={item} key={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Size"
                    name="size"
                    value={productInfo.size}
                    onChange={handleOnchange}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price"
                    name="price"
                    value={productInfo.price}
                    onChange={handleOnchange}
                    variant="outlined"
                    inputMode="numeric"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Color"
                    name="color"
                    value={productInfo.color}
                    onChange={handleOnchange}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Brand"
                    name="brand"
                    value={productInfo.brand}
                    onChange={handleOnchange}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sx={{ margin: "10px auto" }}>
                  <TextField
                    id="filled-textarea"
                    value={productInfo.description}
                    onChange={handleOnchange}
                    label="Description"
                    multiline
                    sx={{ width: "100%" }}
                    variant="outlined"
                    name="description"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sx={{ margin: "10px auto" }}>
                  <InputLabel>Image</InputLabel>
                  <Button variant="contained" component="label">
                    Upload File
                    <input
                      type="file"
                      hidden
                      name="image"
                      onChange={handleUploadImage}
                    />
                  </Button>
                </Grid>
                {previewImage ? (
                  <img src={previewImage} alt="" width="100%" height="100%" />
                ) : (
                  <img
                    src={productInfo.image}
                    alt=""
                    className="w-full h-full"
                  />
                )}
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
                  type="reset"
                  color="error"
                  onClick={handleClose}
                  endIcon={<MdOutlineCancel />}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  endIcon={<MdProductionQuantityLimits />}
                >
                  Add
                </Button>
              </DialogActions>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddProduct;
