import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { getSingleProduct } from '../../Constants/Constant';

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import {
  AiFillCloseCircle,
  AiFillDelete,
  AiOutlineFileDone,
} from "react-icons/ai";
import { toast } from "react-toastify";
import { Transition } from "../../Constants/Constant";
import instance from "../../axios/axios";

const SingleProduct = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const auth = localStorage.getItem("Authorization");

  const [productInfo, setProductInfo] = useState({
    productName: "",
    image: "",
    price: "",
    size: "",
    color: "",
    categoryName: "",
    description: "",
    brand: "",
  });

  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      return navigate("/admin/login");
    }
    const getSingleProduct = async () => {
      const { data } = await instance.get(`/product/${id}`);
      productInfo.productName = data.data.productName;
      productInfo.price = data.data.price;
      productInfo.size = data.data.size;
      productInfo.color = data.data.color;
      productInfo.categoryName = data.data.category.categoryName;
      productInfo.description = data.data.description;
      data.data.brand && (productInfo.brand = data.data.brand);
      setProduct(data.data);
      setLoading(false);
    };
    getSingleProduct();
    window.scroll(0, 0);
  }, [id, productInfo, auth, navigate]);

  const handleOnchange = (e) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
  };
  const handleUploadImage = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setProductInfo({ image: e.target.files[0] });
      console.log(productInfo.image);
    }
  };

  const category = ["suitcase", "handbag", "backpack", "accessory"];
  const color = [
    "red",
    "pink",
    "black",
    "green",
    "yellow",
    "white",
    "purple",
    "blue",
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !productInfo.name &&
      !productInfo.image &&
      !productInfo.price &&
      !productInfo.category &&
      !productInfo.description
    ) {
      toast.error("All fields are required", { autoClose: 500 });
    }
    try {
      const formData = new FormData();
      formData.append("productName", productInfo.productName);
      formData.append("image", productInfo.image);
      formData.append("price", productInfo.price);
      formData.append("color", productInfo.color);
      formData.append("categoryName", productInfo.categoryName);
      formData.append("size", productInfo.size);
      formData.append("description", productInfo.description);
      formData.append("brand", productInfo.brand);
      const { data } = await instance.put(`/product/${product.id}`, formData);

      if (data.status === "success") {
        toast.success("Product updated successfully", { autoClose: 500 });
        navigate(-1);
      } else {
        toast.error("Something went wrong", { autoClose: 500 });
      }
    } catch (error) {
      toast.error("Something went wrong", { autoClose: 500 });
    }
  };
  const deleteProduct = async () => {
    try {
      const { data } = await instance.delete(`/product/${product.id}`);

      if (data.status === "success") {
        toast.success("Product deleted successfully", {
          autoClose: 500,
          theme: "colored",
        });
        navigate(-1);
      } else {
        toast.error("Something went wrong", {
          autoClose: 500,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(error.response.data, { autoClose: 500, theme: "colored" });
    }
  };

  return (
    <>
      <Container sx={{ width: "100%", marginBottom: 5 }}>
        {loading ? (
          <section
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Skeleton variant="rectangular" height={200} width="200px" />
            <Skeleton variant="text" height={400} width={700} />
          </section>
        ) : (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <div className="detail-img-box">
              <img
                alt={product.productName}
                src={product.image}
                className="detail-img"
              />
              <br />
            </div>
            <div>
              <Typography variant="h4">{product.productName}</Typography>
            </div>
          </Box>
        )}
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          style={{ marginTop: 30 }}
        >
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
                label="Size"
                name="size"
                value={productInfo.size}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Color</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={productInfo.color}
                  label="Color"
                  name="color"
                  required
                  onChange={handleOnchange}
                >
                  {color.map((item) => (
                    <MenuItem value={item} key={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            <Grid item xs={12} sm={6} sx={{ margin: "10px auto" }}>
              <TextField
                id="filled-textarea"
                value={productInfo.description}
                onChange={handleOnchange}
                label="Description"
                multiline
                sx={{ width: "100%" }}
                variant="outlined"
                name="description"
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ margin: "10px auto" }}>
              <TextField
                id="filled-textarea"
                value={productInfo.brand}
                onChange={handleOnchange}
                label="Brand"
                multiline
                sx={{ width: "100%" }}
                variant="outlined"
                name="brand"
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
            {previewImage && (
              <img src={previewImage} alt="" width="30%" height="30%" />
            )}
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
            Delete {productInfo.productName}?
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
          <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
            <DialogContentText
              style={{ textAlign: "center" }}
              id="alert-dialog-slide-description"
            >
              <Typography variant="body1">
                Do you want to delete this product?
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Button
              variant="contained"
              endIcon={<AiFillDelete />}
              color="error"
              onClick={deleteProduct}
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
    </>
  );
};

export default SingleProduct;
