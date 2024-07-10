import React, { useEffect } from "react";
import UserInfoItem from "../Components/UserData/UserInfoItem";
import UserCartItem from "../Components/UserData/UserCartItem";
import UserReviewItem from "../Components/UserData/UserReviewItem";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "@mui/material";
import UserOrderItem from "../Components/UserData/UserOrderItem";
import instance from "../../axios/axios";

const SingleUserPage = () => {
  const { id } = useParams();
  const auth = localStorage.getItem("Authorization");
  const navigate = useNavigate();

  useEffect(() => {
    !auth && navigate("/admin/login");
  }, [auth, navigate]);

  const commonGetRequest = async (url, userId, setData) => {
    try {
      const { data } = await instance.get(`${url}/${userId}`);
      setData(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Container>
        <UserInfoItem commonGetRequest={commonGetRequest} id={id} />
        <UserOrderItem commonGetRequest={commonGetRequest} id={id} />
        <UserCartItem commonGetRequest={commonGetRequest} id={id} />
        <UserReviewItem commonGetRequest={commonGetRequest} id={id} />
      </Container>
    </>
  );
};

export default SingleUserPage;
