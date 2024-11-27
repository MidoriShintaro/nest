import React, { useState } from "react";
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
import { AiOutlineSearch } from "react-icons/ai";
import AddCategory from "../AddCategory";
// import AddUser from "../AddUser";
const CategoryTable = ({ categories }) => {
  const columns = [
    {
      id: "code",
      label: "Code",
      minWidth: 100,
      align: "center",
    },
    {
      id: "categoryName",
      label: "Category Name",
      align: "center",
      minWidth: 100,
    },
    {
      id: "date",
      label: "Created On",
      minWidth: 100,
      align: "center",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterCategories = categories.filter((cate) => {
    const categoryName = cate.categoryName.toLowerCase();
    const queries = searchQuery.toLowerCase().split(" ");

    return queries.every((query) => categoryName.includes(query));
  });

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
          label="Search Category"
          onChange={handleSearchInputChange}
          className="placeholder-animation"
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
      <AddCategory />
      <Paper style={{ overflow: "auto" }}>
        <TableContainer component={Paper} sx={{ maxHeight: "400px" }}>
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
              {filterCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <h4> Category not found.</h4>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filterCategories.map((info) => (
                  <TableRow key={info.id}>
                    <TableCell component="th" scope="row" align="center">
                      <Link to={`category/${info.id}`}>{info.code}</Link>
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`category/${info.id}`}>
                        {info.categoryName}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`/category/${info.id}`}>
                        {new Date(info.createdAt).toLocaleDateString("en-us", {
                          weekday: "long",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        {new Date(info.createdAt).toLocaleTimeString("en-US")}
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

export default CategoryTable;
