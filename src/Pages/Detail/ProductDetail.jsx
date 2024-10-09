import "./Productsimilar.css";
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Chip,
  Rating,
  ButtonGroup,
  Skeleton,
} from "@mui/material";
import { MdAddShoppingCart } from "react-icons/md";
import {
  AiFillCloseCircle,
  AiOutlineLogin,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { TbDiscount2 } from "react-icons/tb";
import { toast } from "react-toastify";
import { ContextFunction } from "../../Context/Context";
import ProductReview from "../../Components/Review/ProductReview";
import ProductCard from "../../Components/Card/Product Card/ProductCard";
import { Transition, getSingleProduct } from "../../Constants/Constant";
import instance from "../../axios/axios";

const ProductDetail = () => {
  const { cart, setCart } = useContext(ContextFunction);
  const [openAlert, setOpenAlert] = useState(false);
  const { id, cat } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProduct, setSimilarProduct] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  let authToken = localStorage.getItem("Authorization");
  const user = localStorage.getItem("user");
  let setProceed = authToken ? true : false;
  const navigate = useNavigate();

  useEffect(() => {
    if (setProceed) {
      getSingleProduct(setProduct, id, setLoading);

      const getSimilarProducts = async () => {
        const { data } = await instance.get(`/product/category/${cat}`);
        setSimilarProduct(data.data);
      };
      getSimilarProducts();

      window.scroll(0, 0);
    }
  }, [id, cat, navigate, setProceed]);

  const addToCart = async (product) => {
    if (setProceed) {
      try {
        const { data } = await instance.post(`/cart`, {
          product: product.data.id,
          user: user,
          quantity: productQuantity,
        });
        setCart(data.data);
        setCart([...cart, product]);
        toast.success("Added To Cart", { autoClose: 500, theme: "colored" });
      } catch (error) {
        toast.error(error.response.data.msg, {
          autoClose: 500,
          theme: "colored",
        });
      }
    } else {
      setOpenAlert(true);
    }
  };

  const shareProduct = (product) => {
    const data = {
      text: product.data.productName,
      title: "shop",
      url: `http://localhost:3000/Detail/type/${cat}/${id}`,
    };
    if (navigator.canShare && navigator.canShare(data)) {
      navigator.share(data);
    } else {
      toast.error("browser not support", { autoClose: 500, theme: "colored" });
    }
  };

  let data = [cat];

  const increaseQuantity = () => {
    setProductQuantity((prev) => prev + 1);
    if (productQuantity >= 5) {
      setProductQuantity(5);
    }
  };
  const decreaseQuantity = () => {
    setProductQuantity((prev) => prev - 1);
    if (productQuantity <= 1) {
      setProductQuantity(1);
    }
  };
  return (
    <>
      <Container maxWidth="xl">
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
              Please Login To Proceed
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Link to="/login">
              {" "}
              <Button
                variant="contained"
                endIcon={<AiOutlineLogin />}
                color="primary"
              >
                Login
              </Button>
            </Link>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenAlert(false)}
              endIcon={<AiFillCloseCircle />}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <main className="main-content">
          {loading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : (
            <div className="product-image">
              <div className="detail-img-box">
                <img
                  alt={product.data.productName}
                  src={product.data.image}
                  className="detail-img"
                />
                <br />
              </div>
            </div>
          )}
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
            <section className="product-details">
              <Typography variant="h4">{product.data.productName}</Typography>

              <Typography>{product.data.description}</Typography>
              <Typography>
                <div className="chip">
                  {data.map((item, index) => (
                    <Chip label={item} key={index} variant="outlined" />
                  ))}
                </div>
              </Typography>
              <Chip
                label={
                  product.data.price > 1000 ? "Upto 9% off" : "Upto 38% off"
                }
                variant="outlined"
                sx={{
                  background: "#1976d2",
                  color: "white",
                  width: "150px",
                  fontWeight: "bold",
                }}
                avatar={<TbDiscount2 color="white" />}
              />
              <div style={{ display: "flex", gap: 20 }}>
                <Typography variant="h6" color="red">
                  <s>
                    {" "}
                    {product.data.price > 1000
                      ? product.data.price + 1000
                      : product.data.price + 300}
                    VND
                  </s>{" "}
                </Typography>
                <Typography variant="h6" color="primary">
                  {product.data.price} VND
                </Typography>
              </div>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  // background: 'red',
                  "& > *": {
                    m: 1,
                  },
                }}
              >
                <ButtonGroup
                  variant="outlined"
                  aria-label="outlined button group"
                >
                  <Button onClick={increaseQuantity}>+</Button>
                  <Button>{productQuantity}</Button>
                  <Button onClick={decreaseQuantity}>-</Button>
                </ButtonGroup>
              </Box>
              <Typography>Color: {product.data.color}</Typography>
              <Typography>Size: {product.data.size}</Typography>
              <Rating
                name="read-only"
                value={
                  product.data.reviews.length > 0 &&
                  product.data.reviews.reduce(
                    (total, cur) => total + cur.rate,
                    0
                  ) / product.data.reviews.length
                }
                readOnly
                precision={0.5}
              />
              <div style={{ display: "flex" }}>
                <Tooltip title="Add To Cart">
                  <Button
                    variant="contained"
                    className="all-btn"
                    startIcon={<MdAddShoppingCart />}
                    onClick={() => addToCart(product)}
                  >
                    Buy
                  </Button>
                </Tooltip>
                <Tooltip title="Share">
                  <Button
                    style={{ marginLeft: 10 }}
                    variant="contained"
                    className="all-btn"
                    startIcon={<AiOutlineShareAlt />}
                    onClick={() => shareProduct(product)}
                  >
                    Share
                  </Button>
                </Tooltip>
              </div>
            </section>
          )}
        </main>
        <ProductReview
          setProceed={setProceed}
          authToken={authToken}
          id={id}
          setOpenAlert={setOpenAlert}
        />

        <Typography
          sx={{
            marginTop: 10,
            marginBottom: 5,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Similar Products
        </Typography>
        <Box>
          <Box
            className="similarProduct"
            sx={{ display: "flex", overflowX: "auto", marginBottom: 10 }}
          >
            {similarProduct
              .filter((prod) => prod.id !== id)
              .map((prod) => (
                <Link
                  to={`/Detail/type/${prod.category.categoryName}/${prod.id}`}
                  key={prod.id}
                >
                  <ProductCard prod={prod} />
                </Link>
              ))}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ProductDetail;
