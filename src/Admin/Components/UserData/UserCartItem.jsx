import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import CartCard from "../../../Components/Card/CartCard/CartCard";
import { toast } from "react-toastify";
import instance from "../../../axios/axios";

const UserCartItem = ({ commonGetRequest, id }) => {
  const [userCart, setUserCart] = useState([]);

  const removeCartItemByAdmin = async (product) => {
    try {
      const { data } = await instance.delete(`/cart/${product.id}`);
      if (data.status === "success") {
        setUserCart(
          userCart.filter((c) => c.product.id !== product.product.id)
        );
        toast.success("Removed From Cart", {
          autoClose: 500,
          theme: "colored",
        });
      } else {
        toast.error(data.message, {
          autoClose: 500,
          theme: "colored",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg, {
        autoClose: 500,
        theme: "colored",
      });
    }
  };
  useEffect(() => {
    commonGetRequest("/cart", id, setUserCart);
  }, [commonGetRequest, id, userCart]);
  return (
    <>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ margin: "20px 0", textAlign: "center" }}
      >
        User Cart
      </Typography>
      {userCart.length < 1 && (
        <Typography variant="h6" sx={{ margin: "40px 0", textAlign: "center" }}>
          No items in cart
        </Typography>
      )}
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
        {userCart.map((cart) => (
          <CartCard
            cart={cart}
            removeFromCart={removeCartItemByAdmin}
            key={cart.id}
          />
        ))}
      </Container>
    </>
  );
};

export default UserCartItem;
