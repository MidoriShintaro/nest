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
import AddUser from "../AddUser";
const UserTable = ({ users, getUser }) => {
  const columns = [
    {
      id: "name",
      label: "Name",
      minWidth: 100,
      align: "center",
    },
    {
      id: "phone",
      label: "Phone Number",
      align: "center",
      minWidth: 100,
    },
    {
      id: "email",
      label: "Email",
      minWidth: 70,
      align: "center",
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
  console.log(users);
  const sortedUser = users.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filteredUsers = sortedUser.filter((user) => {
    const username = user.username.toLowerCase();
    const phoneNumber = user.phoneNumber;
    const email = user.email.toLowerCase();
    const queries = searchQuery.toLowerCase().split(" ");

    return queries.every(
      (query) =>
        username.includes(query) ||
        phoneNumber.includes(query) ||
        email.includes(query)
    );
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
          label="Search Users"
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
      <AddUser getUser={getUser} user={sortedUser} />
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
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <h4> User not found.</h4>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((info) => (
                  <TableRow key={info.id}>
                    <TableCell component="th" scope="row" align="center">
                      <Link to={`user/${info.id}`}>{info.username}</Link>
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`user/${info.id}`}>{info.phoneNumber}</Link>
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`user/${info.id}`}>{info.email}</Link>
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`/user/${info.id}`}>
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

export default UserTable;