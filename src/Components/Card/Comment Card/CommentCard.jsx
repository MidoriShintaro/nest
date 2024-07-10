import {
  Avatar,
  Box,
  Button,
  Grid,
  Rating,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AiFillEdit, AiFillDelete, AiOutlineSend } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import { toast } from "react-toastify";
import instance from "../../../axios/axios";

const CommentCard = ({ review, setReviews, reviews, fetchReviews }) => {
  let date = new Date(review.createdAt).toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  let time = new Date(review.createdAt).toLocaleTimeString("en-US");
  const [authUser, setAuthUser] = useState();
  const [editComment, setEditComment] = useState(review.comment);
  const [edit, setEdit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [value, setValue] = useState(review.rate);
  let authToken = localStorage.getItem("Authorization");
  const user = localStorage.getItem("user");
  useEffect(() => {
    authToken && getUser();
  }, []);

  const getUser = async () => {
    const { data } = await instance.get(`/user/${user}`);
    setAuthUser(data.data.id);
    if (data.data.role === "ADMIN") {
      setIsAdmin(true);
    }
  };
  const handleDeleteComment = async () => {
    try {
      const { data } = await instance.delete(`/review/${review.id}`);
      toast.success(data.data.message, { autoClose: 500, theme: "colored" });
      setReviews(reviews.filter((r) => r.id !== review.id));
    } catch (error) {
      toast.success(error, { autoClose: 500, theme: "colored" });
    }
  };
  const deleteCommentByAdmin = async () => {
    if (isAdmin) {
      try {
        const { data } = await instance.delete(`/review/${review.id}`);
        if (data.status === "success") {
          toast.success(data.data, { autoClose: 500, theme: "colored" });
          if (!reviews) {
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            setReviews(reviews.filter((r) => r.id !== review.id));
          }
        }
      } catch (error) {
        console.log(error);
        toast.success("Something went wrong", {
          autoClose: 500,
          theme: "colored",
        });
      }
    } else {
      toast.success("Access denied", { autoClose: 500, theme: "colored" });
    }
  };
  const sendEditResponse = async () => {
    if (!editComment && !value) {
      toast.error("Please Fill the all Fields", { autoClose: 500 });
    } else if (editComment.length <= 4) {
      toast.error("Please add more than 4 characters", { autoClose: 500 });
    } else if (value <= 0) {
      toast.error("Please add rating", { autoClose: 500 });
    } else if (editComment.length >= 4 && value > 0) {
      try {
        if (authToken) {
          const response = await instance.put(`/review/${review.id}`, {
            comment: editComment,
            rate: value,
          });
          console.log(response);
          if (response.data.status === "success") {
            toast.success(response.data.data, { autoClose: 500 });
            if (!fetchReviews) {
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            } else {
              fetchReviews();
            }
            setEdit(false);
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong", { autoClose: 600 });
      }
    }
  };
  return (
    <Grid
      container
      wrap="nowrap"
      spacing={2}
      sx={{
        backgroundColor: "#1976d",
        boxShadow: "0px 8px 13px rgba(0, 0, 0, 0.2)",
        borderRadius: 5,
        margin: "20px auto",
        width: "100%",
        height: "auto",
      }}
    >
      <Grid item>
        <Avatar alt="Customer Avatar" />
      </Grid>
      <Grid justifyContent="left" item xs zeroMinWidth>
        <h4 style={{ margin: 0, textAlign: "left" }}>
          {review?.userId?.username}
        </h4>
        <p style={{ textAlign: "left", marginTop: 10 }}>
          {!edit && (
            <Rating
              name="read-only"
              value={review.rate}
              readOnly
              precision={0.5}
            />
          )}
          {edit && (
            <Rating
              name="simple-controlled"
              value={value}
              precision={0.5}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
          )}
        </p>
        <p
          style={{
            textAlign: "left",
            wordBreak: "break-word",
            paddingRight: 10,
            margin: "10px 0",
          }}
        >
          {!edit && review.comment}
        </p>
        <p>
          {edit && (
            <TextField
              id="standard-basic"
              value={editComment}
              onChange={(e) => {
                setEditComment(e.target.value);
              }}
              label="Edit Review"
              multiline
              className="comment"
              variant="standard"
              sx={{ width: "90%" }}
            />
          )}
        </p>

        {edit && (
          <div
            style={{
              display: "flex",
              gap: 5,
              margin: 10,
            }}
          >
            <Button
              sx={{ width: 10, borderRadius: "30px" }}
              variant="contained"
              onClick={sendEditResponse}
            >
              {" "}
              {<AiOutlineSend />}{" "}
            </Button>
            <Button
              sx={{ width: 10, borderRadius: "30px" }}
              variant="contained"
              color="error"
              onClick={() => setEdit(false)}
            >
              {<GiCancel style={{ fontSize: 15, color: "white" }} />}{" "}
            </Button>
          </div>
        )}

        <p style={{ textAlign: "left", color: "gray", margin: "20px 0" }}>
          {date} {time}
        </p>

        {(authUser === review?.userId?.id || isAdmin) && (
          <Box sx={{ height: 20, transform: "translateZ(0px)", flexGrow: 1 }}>
            <SpeedDial
              ariaLabel="SpeedDial basic example"
              sx={{ position: "absolute", bottom: 16, right: 16 }}
              icon={<SpeedDialIcon />}
            >
              {/* {actions.map((action) => ( */}
              <SpeedDialAction
                icon={<AiFillEdit />}
                tooltipTitle={"Edit"}
                onClick={() => setEdit(true)}
              />
              <SpeedDialAction
                icon={<AiFillDelete />}
                tooltipTitle={"Delete"}
                onClick={isAdmin ? deleteCommentByAdmin : handleDeleteComment}
              />
            </SpeedDial>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default CommentCard;
