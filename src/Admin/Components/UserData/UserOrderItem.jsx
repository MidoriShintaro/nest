import { Box, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProductCard from "../../../Components/Card/Product Card/ProductCard";
import { Link } from "react-router-dom";
import instance from "../../../axios/axios";

const UserOrderItem = ({ commonGetRequest, id }) => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    commonGetRequest("/orderDetail", "", setData);
    const getOrderUser = async () => {
      const res = await instance.get(`/order/${id}`);
      if (res.data.status === "success") {
        setOrder(res.data.data);
      }
    };
    getOrderUser();
  }, [commonGetRequest, id]);

  const total = order.reduce((acc, curr) => {
    if (curr.status === "PAID") {
      acc += curr.totalAmount;
    }
    return acc;
  }, 0);
  return (
    <Container>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ margin: "20px 0", textAlign: "center" }}
      >
        User Orders
      </Typography>
      {data?.length === 0 ? (
        <Typography variant="h6" textAlign="center">
          User not order any thing yet
        </Typography>
      ) : (
        <>
          <Typography variant="h6" textAlign="center">
            Total Amount Spend{" "}
            <span style={{ color: "#1976d2" }}>₹{total} </span>{" "}
          </Typography>
          <Box>
            <Box
              className="similarProduct"
              sx={{
                display: "flex",
                overflowX: "auto",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              {id === data.orderId?.userId &&
                data.map((el) => (
                  <Link
                    to={`/Detail/type/${el.productId.category.categoryName}/${el.productId.id}`}
                    key={el.id}
                  >
                    <ProductCard prod={el.productId} />
                  </Link>
                ))}
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default UserOrderItem;
