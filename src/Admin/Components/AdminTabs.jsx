import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Tab, Tabs, Typography, Box, useMediaQuery, Grid } from "@mui/material";
import ProductChart from "./Charts/ProductChart";
import UserTable from "./Tables/UserTable";
import ProductTable from "./Tables/ProductTable";
import { VscGraph } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaShippingFast } from "react-icons/fa";
import { TbReportMoney } from "react-icons/tb";
import OrderTable from "./Tables/OrderTable";
import Widget from "./Widget";
import instance from "../../axios/axios";
import { BiCategory } from "react-icons/bi";
import CategoryTable from "./Tables/CategoryTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children} </Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ users, getUser }) {
  const [value, setValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [review, setReview] = useState([]);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState([]);
  const [order, setOrder] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    getProductInfo();
  }, []);

  const getProductInfo = async () => {
    try {
      const product = await instance.get("/product");
      const category = await instance.get("/categories");
      const review = await instance.get("/review");
      const cart = await instance.get("/cart");
      const order = await instance.get("/order");
      const orderDetail = await instance.get("/orderDetail");
      setCategory(category.data.data);
      setProducts(product.data.data);
      setReview(review.data.data);
      setCart(cart.data.data);
      setOrder(order.data.data);
      setOrderDetail(orderDetail.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const payment = order.filter((o) => o.status === "PAID");
  const totalRevenue = payment.reduce((acc, curr) => acc + curr.totalDue, 0);
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <Box sx={{ width: "100%" }}>
      <Grid
        container
        spacing={2}
        direction={isSmallScreen ? "column" : "row"}
        padding={1}
      >
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Widget
            numbers={totalRevenue}
            heading="Revenue"
            color="#9932CC"
            icon={<TbReportMoney />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Widget
            numbers={products.length}
            heading="Products"
            color="#FFC300"
            icon={<AiOutlineShoppingCart />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Widget
            numbers={users.length}
            heading="Users"
            color="#FF69B4"
            icon={<CgProfile />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3}>
          <Widget
            numbers={order.length}
            heading="Orders"
            color="#1f77b4  "
            icon={<FaShippingFast />}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          style={{ overflowX: "a" }}
        >
          <Tab
            label={!isSmallScreen && "Statistics"}
            {...a11yProps(0)}
            iconPosition="start"
            icon={<VscGraph fontSize={20} />}
          />
          <Tab
            label={!isSmallScreen && "Category"}
            {...a11yProps(0)}
            iconPosition="start"
            icon={<BiCategory fontSize={20} />}
          />
          <Tab
            label={!isSmallScreen && "Users"}
            {...a11yProps(1)}
            iconPosition="start"
            icon={<CgProfile fontSize={20} />}
          />
          <Tab
            label={!isSmallScreen && "Products"}
            {...a11yProps(2)}
            iconPosition="start"
            icon={<AiOutlineShoppingCart fontSize={20} />}
          />
          <Tab
            label={!isSmallScreen && "Orders"}
            {...a11yProps(3)}
            iconPosition="start"
            icon={<FaShippingFast fontSize={20} />}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ProductChart
          products={category}
          review={review}
          cart={cart}
          paymentData={payment}
          users={users}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CategoryTable categories={category}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <UserTable users={users} paymentData={order} getUser={getUser} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ProductTable data={products} getProductInfo={getProductInfo} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <OrderTable orders={order} orderDetail={orderDetail} />
      </TabPanel>
    </Box>
  );
}