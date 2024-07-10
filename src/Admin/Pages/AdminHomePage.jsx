import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Container } from "@mui/material";
import BasicTabs from "../Components/AdminTabs";
import instance from "../../axios/axios";
const AdminHomePage = () => {
  const [isAdmin, setAdmin] = useState(false);
  const [users, setUsers] = useState({});
  let navigate = useNavigate();
  const auth = localStorage.getItem("Authorization");
  useEffect(() => {
    if (!auth) return navigate("/admin/login");

    const getAllUsers = async () => {
      try {
        const { data } = await instance.get(`/user`);
        if (data.status === "success") {
          setUsers(data.data);
          setAdmin(true);
        }
      } catch (error) {
        !isAdmin && navigate("/");
        toast.error(error.response.data, { autoClose: 500, theme: "colored" });
      }
    };
    getAllUsers();
  }, [isAdmin, navigate, auth]);

  const fetchAgainUsers = async () => {
    try {
      const { data } = await instance.get(`/user`);
      if (data.status === "success") {
        setUsers(data.data);
        setAdmin(true);
      }
    } catch (error) {
      !isAdmin && navigate("/");
      toast.error(error.response.data, { autoClose: 500, theme: "colored" });
    }
  };

  return (
    <>
      {isAdmin && (
        <Container maxWidth="100%">
          <h1
            style={{ textAlign: "center", margin: "20px 0", color: "#1976d2" }}
          >
            Dashboard{" "}
          </h1>
          <BasicTabs users={users} getUser={fetchAgainUsers} />
        </Container>
      )}
    </>
  );
};

export default AdminHomePage;
