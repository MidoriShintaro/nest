import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { Transition } from "../../Constants/Constant";
import { MdOutlineCancel, MdProductionQuantityLimits } from "react-icons/md";
import instance from "../../axios/axios";

const AddCategory = () => {
  const [open, setOpen] = useState(false);

  const [categoryInfo, setCategoryInfo] = useState({
    code: "",
    categoryName: "",
  });
  const handleOnchange = (e) => {
    setCategoryInfo({ ...categoryInfo, [e.target.name]: e.target.value });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //   const getCategoryInfo = async () => {
  //     const { data } = await instance.post(`/categories`);
  //     setCategoryInfo({...categoryInfo, data.data});
  //   };
  //   const category = ["suitcase", "backpack", "handbag", "accessory"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!categoryInfo.code && !categoryInfo.categoryName) {
        toast.error("Please Fill the all Fields", {
          autoClose: 500,
          theme: "colored",
        });
        return;
      } else {
        const { data } = await instance.post(`/categories`, {
          code: categoryInfo.code,
          categoryName: categoryInfo.categoryName,
        });
        if (data.status === "success") {
          toast.success("Category added successfully", {
            autoClose: 500,
            theme: "colored",
          });
          setOpen(false);
          setCategoryInfo({
            productName: "",
            price: "",
          });
        } else {
          toast.error("Some thing went wrong", {
            autoClose: 500,
            theme: "colored",
          });
          return;
        }
      }
    } catch (error) {
      toast.error(error.response.data.error, {
        autoClose: 500,
        theme: "colored",
      });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        <Typography
          variant="h6"
          textAlign="center"
          color="#1976d2"
          fontWeight="bold"
        >
          Add new Category{" "}
        </Typography>
        <Button
          variant="contained"
          endIcon={<MdProductionQuantityLimits />}
          onClick={handleClickOpen}
        >
          Add
        </Button>
      </Box>
      <Divider sx={{ mb: 5 }} />
      <Dialog
        open={open}
        onClose={handleClose}
        keepMounted
        TransitionComponent={Transition}
      >
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "bold", color: "#1976d2" }}
        >
          {" "}
          Add new Category
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Code"
                    name="code"
                    value={categoryInfo.code}
                    onChange={handleOnchange}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Category Name"
                    name="categoryName"
                    value={categoryInfo.categoryName}
                    onChange={handleOnchange}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <DialogActions
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  type="reset"
                  color="error"
                  onClick={handleClose}
                  endIcon={<MdOutlineCancel />}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  endIcon={<MdProductionQuantityLimits />}
                >
                  Add
                </Button>
              </DialogActions>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddCategory;
