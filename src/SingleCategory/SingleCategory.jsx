import "./singlecategory.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Container } from "@mui/system";
import { Box, Button, MenuItem, FormControl, Select } from "@mui/material";
import Loading from "../Components/loading/Loading";
import { BiFilterAlt } from "react-icons/bi";
import ProductCard from "../Components/Card/Product Card/ProductCard";
import instance from "../axios/axios";

const SingleCategory = () => {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterOption, setFilterOption] = useState("All");
  const [title, setTitle] = useState("All");
  const { cat } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("Authorization");
  useEffect(() => {
    if (!token) navigate("/login");
    const getCategoryProduct = async () => {
      try {
        setIsLoading(true);
        const { data } = await instance.get(`/product/category/${cat}`);
        if (data.status === "success") {
          setProductData(data.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getCategoryProduct();
    window.scroll(0, 0);
  }, [cat, navigate, token]);

  const productFilter = [
    "All",
    "Price Low To High",
    "Price High To Low",
    "High Rated",
    "Low Rated",
  ];

  // if (cat === "handbag") {
  //   productFilter.push(
  //     "All",
  //     "Price Low To High",
  //     "Price High To Low",
  //     "High Rated",
  //     "Low Rated"
  //   );
  // } else if (cat === "suitcase") {
  //   productFilter.push(
  //     "All",
  //     "Men",
  //     "Women",
  //     "Price Low To High",
  //     "Price High To Low",
  //     "High Rated",
  //     "Low Rated"
  //   );
  // } else if (cat === "backpack") {
  //   productFilter.push(
  //     "All",
  //     "Price Low To High",
  //     "Price High To Low",
  //     "High Rated",
  //     "Low Rated"
  //   );
  // } else if (cat === "accessory") {
  //   productFilter.push(
  //     "All",
  //     "Price Low To High",
  //     "Price High To Low",
  //     "High Rated",
  //     "Low Rated"
  //   );
  // } else if (cat === "jewelry") {
  //   productFilter.push("All");
  // }

  const handleChange = (e) => {
    setFilterOption(e.target.value.split(" ").join("").toLowerCase());
    setTitle(e.target.value);
  };
  // pricelowtohigh
  // pricehightolow
  // highrated
  // lowrated

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const filter = filterOption.toLowerCase();
      const { data } = await instance.post(`/product/category`, {
        categoryName: cat,
        filter: filter,
      });
      setProductData(data.data);
      setIsLoading(false);
    };
    getData();
  }, [filterOption, cat]);

  const loading = isLoading ? (
    <Container
      maxWidth="xl"
      style={{
        marginTop: 10,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        paddingLeft: 10,
        paddingBottom: 20,
      }}
    >
      <Loading />
      <Loading />
      <Loading />
      <Loading />
      <Loading />
      <Loading />
      <Loading />
      <Loading />
    </Container>
  ) : (
    ""
  );
  return (
    <>
      <Container
        maxWidth="xl"
        style={{
          marginTop: 90,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box sx={{ minWidth: 140 }}>
          <FormControl sx={{ width: 140 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                width: "80vw",
              }}
            >
              <Button endIcon={<BiFilterAlt />}>Filters</Button>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={title}
                sx={{ width: 200 }}
                onChange={(e) => handleChange(e)}
              >
                {productFilter.map((prod) => (
                  <MenuItem key={prod} value={prod}>
                    {prod}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </FormControl>
        </Box>
        {loading}
        <Container
          maxWidth="xl"
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            paddingBottom: 20,
            marginBottom: 30,
            width: "100%",
          }}
        >
          {productData?.map((prod) => (
            
            <Link to={`/Detail/type/${cat}/${prod.id}`} key={prod.id}>
              <ProductCard prod={prod} />
              {console.log(prod)}
            </Link>
          ))}
        </Container>
      </Container>
    </>
  );
};

export default SingleCategory;
