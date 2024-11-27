import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AiOutlineFileDone } from "react-icons/ai";
import { Box, Button, Typography } from "@mui/material";
import { payment } from "../../Assets/Images/Image";
import "./Payment.css";
import instance from "../../axios/axios";
import { useEffect, useState } from "react";
const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const app_trans_id = searchParams[0].get("apptransid");
  const navigate = useNavigate();
  const shipValue = localStorage.getItem("shipping");
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState(true);
  const user = localStorage.getItem("user");

  const getResult = async () => {
    const response = await instance.get(
      `/zalopay/result?app_trans_id=${app_trans_id}`
    );
    const order = orders.find((o) => o.orderCode === app_trans_id);
    if (response.data.data.return_message !== "Giao dịch thành công") {
      setStatus(false);
      await instance.put(`/order/${order.id}`, { status: "NOTPAY" });
      // return navigate("/checkout");
    }
  };
  getResult();

  useEffect(() => {
    const getOrder = async () => {
      const response = await instance.get(`/order/user/${user}`);
      if (response.data.status === "success") {
        setOrders(response.data.data);
      }
    };
    getOrder();
    // getResult();
  }, [user]);

  const paymentSuccess = async () => {
    const order = orders.find((o) => o.orderCode === app_trans_id);
    await instance.put(`/order/${order.id}`, {
      status: "PAID",
    });
    const response = await instance.post("/payment", {
      method: "ZALOPAY",
      orderId: order?.id,
      shipValue: Number(shipValue),
    });
    if (response.data.status === "success") {
      await instance.delete(`/cart/user/${user}`);
      navigate("/");
    }
  };

  return (
    <>
      <div className="main-payment-box">
        <Typography variant="h6" sx={{ marginTop: 1 }}>
          Payment {status === true ? "Successfully" : "Canceled"}{" "}
          <AiOutlineFileDone style={{ color: "#1976d2" }} />
        </Typography>
        <Typography variant="body2">
          {status === true ? `Reference Number = ${app_trans_id}` : ""}
        </Typography>
        <Typography variant="body2" textAlign="center">
          {status === true ? (
            <>
              Your payment has been successfully submitted.
              <br />
              We've sent you an email with all of the details of your order.
            </>
          ) : (
            <>
              <h1 style={{ color: "red" }}>
                Your payment has been canceled submitted.
              </h1>
              <br />
              {/* oc We've sent you an email with all of the details of your order. */}
            </>
          )}
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="main-payment-card">
            <img src={payment} alt="payment" className="payment-img" />
            {status === true ? (
              <div style={{ color: "white" }}>
                <Button
                  variant="contained"
                  sx={{ borderRadius: 3 }}
                  onClick={paymentSuccess}
                >
                  Back To Home
                </Button>
              </div>
            ) : (
              <Link style={{ color: "white" }} to={"/checkout"}>
                <Button variant="contained" sx={{ borderRadius: 3 }}>
                  Back To Checkout
                </Button>
              </Link>
            )}
          </div>
        </Box>
      </div>
    </>
  );
};

export default PaymentSuccess;
