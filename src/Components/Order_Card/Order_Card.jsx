import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdPriorityHigh } from "react-icons/md";
import Box from "@mui/material/Box";
import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import instance from "../../axios/axios";
import { useNavigate } from "react-router-dom";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { BiArrowFromLeft } from "react-icons/bi";
import { GiCancel } from "react-icons/gi";
import numeral from "numeral";
import { Transition } from "../../Constants/Constant";
import { AiFillCloseCircle, AiFillDelete } from "react-icons/ai";

const OrderCard = ({ order, index }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const auth = localStorage.getItem("Authorization");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [openOrderId, setOpenOrderId] = useState("");

  const fetchOrder = async () => {
    const { data } = await instance.get("/order");
    if (data.status === "success") {
      setOrders(data.data);
    }
  };

  const updateOrder = async (id, status) => {
    await instance.put(`/order/${id}`, { status });
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const orderCreatedTime = new Date(order.createdAt);
      const currentTime = new Date();
      const timeDifference = (currentTime - orderCreatedTime) / 1000;
      const initialTimeLeft = 15 * 60 - timeDifference;
      return initialTimeLeft > 0 ? initialTimeLeft : 0;
    };
    setTimeLeft(calculateTimeLeft());
  }, [order.createdAt]);

  useEffect(() => {
    let timerId;
    if (timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      updateOrder(order.id, "EXPIRES");
      fetchOrder();
      clearInterval(timerId);
    }
    return () => clearInterval(timerId);
  }, [timeLeft, order]);

  const fetchOrderDetails = async () => {
    const { data } = await instance.get(`/orderDetail`);
    setOrderDetails(data.data);
  };

  const processToCheckout = async (order) => {
    const date = new Date();
    const orderCode =
      date.getDate().toString() +
      (date.getMonth() + 1).toString() +
      date.getFullYear().toString().slice(2, 4) +
      "_" +
      Math.floor(100000 + Math.random() * 900000);

    const { data } = await instance.put(`/order/${order.id}`, {
      orderCode,
      status: order.status,
    });
    const redirect = await instance.get(
      `/zalopay/create?amount=${data.data.totalDue}&username=${order.userId.username}&app_trans_id=${orderCode}`
    );
    if (redirect.data.data.return_message === "Giao dịch thành công") {
      window.location.href = redirect.data.data.order_url;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(0) - 1;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`;
  };

  const cancelOrder = async () => {
    await instance.put(`/order/${order.id}`, { status: "CANCEL" });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    fetchOrder();
    fetchOrderDetails();
  }, [auth, navigate]);

  return (
    <React.Fragment key={order.id + 1}>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() =>
              setOpenOrderId(openOrderId === order.id ? "" : order.id)
            }
          >
            {<MdKeyboardArrowDown />}
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row">
          <p>{index + 1}</p>
        </TableCell>
        <TableCell>
          <p>{order?.orderCode}</p>
        </TableCell>
        <TableCell>
          <p
            style={{
              color:
                order.status === "PAID"
                  ? "green"
                  : order.status === "NOTPAID"
                  ? "gray"
                  : "red",
            }}
          >
            <b>{order?.status}</b>
          </p>
        </TableCell>
        <TableCell>
          <p>{numeral(order?.totalDue).format("0,0")}đ</p>
        </TableCell>
        <TableCell>
          <p>{order.address}</p>
        </TableCell>
        <TableCell>
          {orderDetails.map((od) => {
            console.log(od);
            return (
              od.orderId?.id === order.id && (
                <>
                  {order.status === "PAID" ? (
                    <p>
                      <b style={{ color: "green" }}>
                        {new Date(order.updatedAt).toLocaleTimeString("en-US")}
                      </b>
                    </p>
                  ) : order.status === "EXPIRES" ? (
                    <p>
                      <b style={{ color: "gray" }}>Order Expires</b>
                    </p>
                  ) : order.status === "CANCEL" ? (
                    <p>
                      <b style={{ color: "red" }}>Order Canceled</b>
                    </p>
                  ) : (
                    <p>
                      <b style={{ color: "blue" }}>{formatTime(timeLeft)}</b>
                    </p>
                  )}
                </>
              )
            );
          })}
        </TableCell>
        <TableCell>
          <Box
            sx={{
              display: "flex",
              justifyContent: "",
              alignItems: "",
              margin: "5px",
              width: "100%",
            }}
          >
            {order.status === "PAID" ? (
              <Button
                variant="contained"
                color="success"
                style={{ marginRight: "5px" }}
                endIcon={<RiCheckboxCircleFill />}
              >
                PAID
              </Button>
            ) : order.status === "NOTPAY" ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: "5px" }}
                  endIcon={<BiArrowFromLeft />}
                  onClick={() => processToCheckout(order)}
                >
                  Continue checkout
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<GiCancel />}
                  onClick={() => setOpenAlert(true)}
                >
                  Cancel Order
                </Button>
              </>
            ) : order.status === "EXPIRES" ? (
              <Button
                variant="contained"
                color="warning"
                style={{ marginRight: "5px" }}
                endIcon={<MdPriorityHigh />}
              >
                EXPIRES
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                style={{ marginRight: "5px" }}
                endIcon={<GiCancel />}
              >
                Cancel
              </Button>
            )}
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
                  Do you want cancel order?
                </Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                variant="contained"
                endIcon={<AiFillDelete />}
                color="error"
                onClick={cancelOrder}
              >
                Cancel
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
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openOrderId === order?.id} timeout="auto" unmountOnExit>
            <div>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="left"
                      sx={{
                        color: "#1976d2",
                        fontWeight: "bold",
                      }}
                    >
                      Product Name
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        color: "#1976d2",
                        fontWeight: "bold",
                      }}
                    >
                      Image
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        color: "#1976d2",
                        fontWeight: "bold",
                      }}
                    >
                      Price
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        color: "#1976d2",
                        fontWeight: "bold",
                      }}
                    >
                      Quantity
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderDetails.map((product) => (
                    <TableRow key={order.id}>
                      <TableCell align="left">
                        {product.productId?.productName.slice(0, 20) + "..."}
                      </TableCell>
                      <TableCell align="left">
                        <img
                          src={product.productId?.image}
                          alt={product.productId?.productName}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <p>{numeral(product.productId?.price).format("0,0")}</p>
                      </TableCell>
                      <TableCell align="left">
                        <p>{product.quantity}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default OrderCard;
