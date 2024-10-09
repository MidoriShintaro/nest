import React, { useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext } from "react";
import { ContextFunction } from "../../Context/Context";
import CategoryCard from "../../Components/Category_Card/CategoryCard";
import BannerData from "../../Helpers/HomePageBanner";
import Carousel from "../../Components/Carousel/Carousel";
import SearchBar from "../../Components/SearchBar/SearchBar";
import instance from "../../axios/axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { setCart } = useContext(ContextFunction);
  const navigate = useNavigate();
  let userId = localStorage.getItem("user");
  const auth = localStorage.getItem("Authorization");
  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }
  }, [auth, navigate]);

  useEffect(() => {
    const getCart = async () => {
      const { data } = await instance.get(`/cart/${userId}`);
      setCart(data.data);
    };
    getCart();
    window.scroll(0, 0);
  }, [userId, setCart]);

  return (
    <>
      <Container
        maxWidth="xl"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 0,
          flexDirection: "column",
          marginBottom: 70,
        }}
      >
        <Box padding={1}>
          <Carousel />
        </Box>
        <Container
          style={{ marginTop: 90, display: "flex", justifyContent: "center" }}
        >
          <SearchBar />
        </Container>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            marginTop: 10,
            color: "#1976d2",
            fontWeight: "bold",
          }}
        >
          Categories
        </Typography>
        <Container
          maxWidth="xl"
          style={{
            marginTop: 90,
            display: "flex",
            justifyContent: "center",
            flexGrow: 1,
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          {BannerData.map((data) => (
            <CategoryCard data={data} key={data.img} />
          ))}
        </Container>
      </Container>
    </>
  );
};

export default HomePage;
