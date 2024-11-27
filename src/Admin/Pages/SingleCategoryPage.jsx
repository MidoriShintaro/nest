import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { getSingleProduct } from '../../Constants/Constant';

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import {
  AiFillCloseCircle,
  AiFillDelete,
  AiOutlineFileDone,
} from "react-icons/ai";
import { toast } from "react-toastify";
import { Transition } from "../../Constants/Constant";
import instance from "../../axios/axios";
import { TiArrowBackOutline } from "react-icons/ti";

const SingleCategoryPage = () => {
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);

  const auth = localStorage.getItem("Authorization");

  const [categoryInfo, setCategoryInfo] = useState({
    code: "",
    categoryName: "",
  });

  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      return navigate("/admin/login");
    }
    const getSingleCategory = async () => {
      const { data } = await instance.get(`/categories/${id}`);
      setCategory(data.data);

      categoryInfo.code = data.data.code;
      categoryInfo.categoryName = data.data.categoryName;

      setLoading(false);
    };
    getSingleCategory();
    window.scroll(0, 0);
  }, [id, auth, navigate]);

  const handleOnchange = (e) => {
    setCategoryInfo({ ...categoryInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryInfo.code || !categoryInfo.categoryName) {
      return toast.error("All fields are required", { autoClose: 500 });
    }
    try {
      const { data } = await instance.put(`/categories/${category.id}`, {
        code: categoryInfo.code,
        categoryName: categoryInfo.categoryName,
      });

      if (data.status === "success") {
        toast.success("Category updated successfully", { autoClose: 500 });
        navigate(-1);
      } else {
        toast.error("Something went wrong", { autoClose: 500 });
      }
    } catch (error) {
      toast.error("Something went wrong", { autoClose: 500 });
    }
  };
  const deleteCategory = async () => {
    try {
      const { data } = await instance.delete(`/categories/${category.id}`);

      if (data.status === "success") {
        toast.success("Category deleted successfully", {
          autoClose: 500,
          theme: "colored",
        });
        return navigate(-1);
      } else {
        toast.error("Something went wrong", {
          autoClose: 500,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(error.response.data, { autoClose: 500, theme: "colored" });
    }
  };

  return (
    <>
      <Container sx={{ width: "100%", marginBottom: 5 }}>
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
        ) : (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <div>
              <Typography variant="h4">
                Category {category.categoryName}
              </Typography>
            </div>
          </Box>
        )}
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          style={{ marginTop: 30 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Code of Category"
                name="code"
                value={categoryInfo.code}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category Name"
                name="categoryName"
                value={categoryInfo.categoryName}
                onChange={handleOnchange}
                variant="outlined"
                inputMode="numeric"
                fullWidth
              />
            </Grid>
          </Grid>
          <Container
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 5,
            }}
          >
            <Button
              variant="contained"
              endIcon={<AiOutlineFileDone />}
              type="submit"
            >
              Save
            </Button>
            <Button
              variant="contained"
              endIcon={<TiArrowBackOutline />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Container>
        </form>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            margin: "25px 0",
            width: "100%",
          }}
        >
          <Typography variant="h6">
            Delete {categoryInfo.categoryName}?
          </Typography>
          <Button
            variant="contained"
            color="error"
            endIcon={<AiFillDelete />}
            onClick={() => setOpenAlert(true)}
          >
            Delete
          </Button>
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
                Do you want to delete this category?
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Button
              variant="contained"
              endIcon={<AiFillDelete />}
              color="error"
              onClick={deleteCategory}
            >
              Delete
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
      </Container>
    </>
  );
};

export default SingleCategoryPage;
