import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Skeleton,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
} from "@mui/material";
import { AiFillCloseCircle, AiOutlineLogin } from "react-icons/ai";
import { Transition } from "../../Constants/Constant";
import instance from "../../axios/axios";
import OrderCard from "../../Components/Order_Card/Order_Card";

const Order = () => {
  const [openAlert, setOpenAlert] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  let authToken = localStorage.getItem("Authorization");
  const user = localStorage.getItem("user");
  let setProceed = authToken ? true : false;
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) navigate("/login");
    if (setProceed) {
      const getOrder = async () => {
        const { data } = await instance.get(`/order/user/${user}`);
        setOrders(data.data);
        setLoading(false);
      };
      getOrder();
    }
  }, [user, setProceed, authToken, navigate]);
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

        <main className="main-content" style={{ width: "100%" }}>
          {loading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : (
            <div className="product-image">
              {/* <div className="detail-img-box">
                <img
                  alt={product.data.productName}
                  src={product.data.image}
                  className="detail-img"
                />
                <br />
              </div> */}
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
          ) : orders.length > 0 ? (
            <section className="orders" style={{ width: "100%" }}>
              <TableContainer
                sx={{ height: "100%", border: "1px", width: "100%" }}
              >
                <Table stickyHeader aria-label="sticky table">
                  <TableHead sx={{ position: "sticky", top: 0 }}>
                    <TableRow>
                      <TableCell />
                      <TableCell sx={{ color: "#1976d2", fontWeight: "bold" }}>
                        Index
                      </TableCell>
                      <TableCell sx={{ color: "#1976d2", fontWeight: "bold" }}>
                        Order Code
                      </TableCell>
                      <TableCell sx={{ color: "#1976d2", fontWeight: "bold" }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ color: "#1976d2", fontWeight: "bold" }}>
                        Total Amount
                      </TableCell>
                      <TableCell sx={{ color: "#1976d2", fontWeight: "bold" }}>
                        Address
                      </TableCell>
                      <TableCell sx={{ color: "#1976d2", fontWeight: "bold" }}>
                        Order Remaining Time
                      </TableCell>
                      <TableCell sx={{ color: "#1976d2", fontWeight: "bold" }}>
                        Actions / PAID
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order, index) => (
                      <OrderCard order={order} index={index} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>
          ) : (
            <section
              className="orders"
              style={{ width: "100%", textAlign: "center" }}
            >
              <h1>No Order</h1>
            </section>
          )}
        </main>
      </Container>
    </>
  );
};

export default Order;
