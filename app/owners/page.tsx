"use client";
import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import { Button, Toolbar } from "@mui/material";
import styled from "@emotion/styled";
import { Homeowners } from "@prisma/client";
import axios from "axios";

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex: 1;
  height: 100hv;
`;

type Owner = Homeowners;

type CreateOwner = {
  name: string;
  phone: string;
  citizenId: string;
  active: boolean;
};

interface Column {
  id: "fullname" | "phone" | "cittizenId" | "active";
  label: string;
  minWidth?: number;
  align?: "right";
}

const columns: readonly Column[] = [
  { id: "fullname", label: "Tên chủ nhà", minWidth: 170 },
  { id: "phone", label: "Số Điện thoại", minWidth: 100 },
  {
    id: "cittizenId",
    label: "citizenID",
    minWidth: 170,
    align: "right",
  },
  {
    id: "active",
    label: "Trạng thái",
    minWidth: 170,
    align: "right",
  },
];

export default function Owners() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [owners, setOwners] = React.useState<Owner[]>([]);
  const [open, setOpen] = React.useState(false);

  const [dataCreateOwner, setCreateOwner] = React.useState<CreateOwner>({
    name: "",
    phone: "",
    citizenId: "",
    active: true,
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
    axios
      .post("/api/owner", dataCreateOwner)
      .then(function (response) {
        console.log(response);
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    axios.get("/api/owner").then(function (response) {
      setOwners(response.data);
      console.log(response.data);
    });
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Wrapper>
      <Dashboard />
      <WrapperContainer>
        <Header />
        <Toolbar />
        <Button
          sx={{ position: "absolute", right: "20px" }}
          variant="outlined"
          onClick={handleClickOpen}
        >
          Add Owner
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Owner</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText> */}
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              onChange={(e) => {
                setCreateOwner({ ...dataCreateOwner, name: e.target.value });
              }}
            />
            <TextField
              margin="dense"
              id="phone"
              label="Number phone"
              type="text"
              fullWidth
              onChange={(e) => {
                setCreateOwner({ ...dataCreateOwner, phone: e.target.value });
              }}
            />
            <TextField
              margin="dense"
              id="citizen"
              label="CitizenID"
              type="text"
              fullWidth
              onChange={(e) => {
                setCreateOwner({
                  ...dataCreateOwner,
                  citizenId: e.target.value,
                });
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
        <Paper sx={{ marginTop: "60px", width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 800 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {owners
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.fullname}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={owners.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </WrapperContainer>
    </Wrapper>
  );
}
