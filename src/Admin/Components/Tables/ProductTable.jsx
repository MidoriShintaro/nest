import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import AddProduct from "../AddProduct";
import numeral from "numeral";
const ProductTable = ({ data, getProductInfo }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const columns = [
    {
      id: "name",
      label: "Name",
      minWidth: 170,
      align: "center",
    },
    {
      id: "image",
      label: "Image",
      minWidth: 100,
      align: "center",
    },
    {
      id: "brand",
      label: "Brand",
      align: "center",
      minWidth: 100,
    },
    {
      id: "price",
      label: "Price",
      minWidth: 100,
      align: "center",
    },
    {
      id: "rating",
      label: "Rating",
      minWidth: 100,
      align: "center",
    },
  ];
  const filterData = () => {
    if (searchTerm === "") {
      return data;
    }
    return data.filter(
      (item) =>
        (item.productName &&
          item.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.price &&
          item.price
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (item.category?.categoryName &&
          item.category?.categoryName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
  };
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const newFilteredData = filterData();
    setFilteredData(newFilteredData);
  };

  useEffect(() => {
    const filterData = () => {
      if (searchTerm === "") {
        return data;
      }
      return data.filter(
        (item) =>
          (item.productName &&
            item.productName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (item.price &&
            item.price
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (item.category?.categoryName &&
            item.category?.categoryName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    };
    setFilteredData(filterData());
  }, [data, searchTerm]);

  return (
    <>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 5,
          marginTop: 5,
        }}
      >
        <TextField
          id="search"
          type="search"
          label="Search Products"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: { xs: 350, sm: 500, md: 800 } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <AiOutlineSearch />
              </InputAdornment>
            ),
          }}
        />
      </Container>
      <AddProduct getProductInfo={getProductInfo} data={data} />
      <Paper
        style={{
          overflow: "auto",
          maxHeight: "500px",
        }}
      >
        <TableContainer sx={{ maxHeight: "500px" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead sx={{ position: "sticky", top: 0 }}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      color: "#1976d2",
                      fontWeight: "bold",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <h4> Product not found.</h4>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((prod) => (
                  <TableRow key={prod._id}>
                    <TableCell component="th" scope="row" align="center">
                      <Link
                        to={`/admin/home/product/${prod.category?.categoryName}/${prod.id}`}
                      >
                        {prod.productName.slice(0, 20)}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <Link
                        to={`/admin/home/product/${prod.category?.categoryName}/${prod.id}`}
                      >
                        <img
                          src={prod.image}
                          alt={prod.productName}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <Link
                        to={`/admin/home/product/${prod.category?.categoryName}/${prod.id}`}
                      >
                        {prod.brand}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <Link
                        to={`/admin/home/product/${prod.category?.categoryName}/${prod.id}`}
                      >
                        {numeral(prod.price).format("0,0")}đ
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <Link
                        to={`/admin/home/product/${prod.category?.categoryName}/${prod.id}`}
                      >
                        {prod.reviews.length > 0
                          ? Math.round(
                              prod.reviews.reduce(
                                (tol, cur) => tol + cur.rate,
                                0
                              ) / prod.reviews.length
                            ) + ".0"
                          : 0}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default ProductTable;
