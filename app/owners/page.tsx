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
import { Button, IconButton, Toolbar, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "@emotion/styled";
import { Homeowners } from "@prisma/client";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRouter } from "next/navigation";
import DeleteRecipientDialog from "../components/DialogWarnning";

dayjs.extend(utc);

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
  birthday: Date;
  citizenId: string;
  citizen_ngaycap: Date;
  citizen_noicap: String;
  STK: String;
  TenTK: String;
  bank: String;
  email: String;
};

interface Column {
  id:
    | "fullname"
    | "phone"
    | "birthday"
    | "citizenId"
    | "citizen_ngaycap"
    | "citizen_noicap"
    | "STK"
    | "bank"
    | "active";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: String) => String;
}

const columns: readonly Column[] = [
  { id: "fullname", label: "Tên chủ nhà", minWidth: 170 },
  { id: "phone", label: "Số Điện thoại", minWidth: 100 },
  {
    id: "birthday",
    label: "Ngày sinh",
    minWidth: 170,
    align: "right",
  },
  {
    id: "citizenId",
    label: "Số CCCD",
    minWidth: 170,
    align: "right",
  },
  {
    id: "citizen_ngaycap",
    label: "Ngày cấp CCCD",
    minWidth: 170,
    align: "right",
  },
  {
    id: "citizen_noicap",
    label: "Nơi cấp CCCD",
    minWidth: 170,
    align: "right",
  },
  {
    id: "STK",
    label: "Số tài khoản",
    minWidth: 170,
    align: "right",
  },
  {
    id: "bank",
    label: "Tên ngân hàng",
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
  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [openDialogDetele, setOpenDialogDetele] = useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [owners, setOwners] = React.useState<Owner[]>([]);
  const [owner, setOwner] = React.useState<Owner>();
  const [open, setOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [value, setValue] = React.useState<Dayjs | null>();

  const [dataCreateOwner, setCreateOwner] = React.useState<CreateOwner>({
    name: "",
    phone: "",
    birthday: new Date(),
    citizenId: "",
    citizen_ngaycap: new Date(),
    citizen_noicap: "",
    STK: "",
    TenTK: "",
    bank: "",
    email: "",
  });

  const handleEdit = (id: number) => {
    setSelectedRecord(id);
    axios
      .get(`/api/owner/${id}`)
      .then(function (response) {
        setOwner(response.data);
        setCreateOwner({
          ...dataCreateOwner,
          name: response.data.fullname,
          phone: response.data.phone,
          email: response.data.email,
          birthday: response.data.birthday,
          citizenId: response.data.citizenId,
          citizen_ngaycap: response.data.citizen_ngaycap,
          citizen_noicap: response.data.citizen_noicap,
          STK: response.data.STK,
          TenTK: response.data.TenTK,
          bank: response.data.bank,
        });
        setOpen(true);
      })
      .catch(function (error) {
        console.error("Error fetching owner data:", error);
      });
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`/api/owner/${id}`)
      .then(function (response) {
        window.location.reload();
      })
      .catch(function (error) {
        console.error("Error delete owner data:", error);
      });
  };

  const handleCloseDialogDatele = () => {
    setOpenDialogDetele(false);
    setSelectedRecord(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRecord(null);
  };

  const handleSubmit = () => {
    setOpen(false);
    console.log(dataCreateOwner);
    axios
      .post("/api/owner", dataCreateOwner)
      .then(function (response) {
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    axios.get("/api/owner").then(function (response) {
      setOwners(response.data);
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
        <Typography variant="h5" sx={{ margin: "15px" }}>
          Danh sách chủ nhà
        </Typography>
        <Button
          sx={{ position: "absolute", right: "20px" }}
          variant="outlined"
          onClick={handleClickOpen}
        >
          Thêm thông tin chủ nhà
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {selectedRecord === null
              ? "Thêm thông tin chủ nhà"
              : "Chỉnh sửa thông tin chủ nhà"}
          </DialogTitle>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TextField
                required
                autoFocus
                margin="dense"
                id="name"
                label="Tên chủ nhà"
                type="text"
                defaultValue={selectedRecord === null ? "" : owner?.fullname}
                fullWidth
                onChange={(e) => {
                  setCreateOwner({ ...dataCreateOwner, name: e.target.value });
                }}
              />
              <TextField
                required
                margin="dense"
                id="phone"
                label="Số điện thoại"
                type="text"
                defaultValue={selectedRecord === null ? "" : owner?.phone}
                fullWidth
                onChange={(e) => {
                  setCreateOwner({ ...dataCreateOwner, phone: e.target.value });
                }}
              />
              <DemoContainer components={["DateField"]}>
                <DateField
                  fullWidth
                  id="birthday"
                  label="Ngày Sinh"
                  defaultValue={
                    selectedRecord === null
                      ? dayjs("2001-01-01")
                      : dayjs.utc(owner?.birthday)
                  }
                  onChange={(newValue) => {
                    if (newValue) {
                      const temp = newValue?.toDate();
                      setCreateOwner({
                        ...dataCreateOwner,
                        birthday: temp,
                      });
                    }
                  }}
                />
              </DemoContainer>
              <TextField
                required
                margin="dense"
                id="email"
                label="Email"
                type="email"
                defaultValue={selectedRecord === null ? "" : owner?.email}
                fullWidth
                onChange={(e) => {
                  setCreateOwner({ ...dataCreateOwner, email: e.target.value });
                }}
              />
              <TextField
                required
                margin="dense"
                id="citizen"
                label="Số CCCD"
                type="text"
                defaultValue={selectedRecord === null ? "" : owner?.citizenId}
                fullWidth
                onChange={(e) => {
                  setCreateOwner({
                    ...dataCreateOwner,
                    citizenId: e.target.value,
                  });
                }}
              />
              <DemoContainer components={["DateField"]}>
                <DateField
                  fullWidth
                  id="citizen_ngaycap"
                  label="Ngày cấp CCCD"
                  defaultValue={
                    selectedRecord === null
                      ? dayjs("2001-01-01")
                      : dayjs.utc(owner?.citizen_ngaycap)
                  }
                  value={value}
                  // onChange={(newValue) => setValue(newValue)}
                  onChange={(newValue) => {
                    if (newValue) {
                      const temp = newValue?.toDate();
                      setCreateOwner({
                        ...dataCreateOwner,
                        citizen_ngaycap: temp,
                      });
                    }
                  }}
                />
              </DemoContainer>
              <TextField
                required
                margin="dense"
                id="citizen_noicap"
                label="Nơi cấp CCCD"
                type="text"
                defaultValue={
                  selectedRecord === null ? "" : owner?.citizen_noicap
                }
                fullWidth
                onChange={(e) => {
                  setCreateOwner({
                    ...dataCreateOwner,
                    citizen_noicap: e.target.value,
                  });
                }}
              />
              <TextField
                margin="dense"
                id="STK"
                label="Số Tài khoản"
                type="text"
                defaultValue={selectedRecord === null ? "" : owner?.STK}
                fullWidth
                onChange={(e) => {
                  setCreateOwner({
                    ...dataCreateOwner,
                    STK: e.target.value,
                  });
                }}
              />
              <TextField
                margin="dense"
                id="TenTK"
                label="Tên chủ STK"
                type="text"
                defaultValue={selectedRecord === null ? "" : owner?.TenTK}
                fullWidth
                onChange={(e) => {
                  setCreateOwner({
                    ...dataCreateOwner,
                    TenTK: e.target.value,
                  });
                }}
              />
              <TextField
                margin="dense"
                id="bank"
                label="Tên ngân hàng"
                type="text"
                defaultValue={selectedRecord === null ? "" : owner?.bank}
                fullWidth
                onChange={(e) => {
                  setCreateOwner({
                    ...dataCreateOwner,
                    bank: e.target.value,
                  });
                }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button onClick={handleSubmit}>Lưu</Button>
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
                        key={row.homeOwnerId}
                      >
                        {columns.map((column) => {
                          let value: string | Date | boolean = row[column.id];

                          if (
                            (column.id === "birthday" ||
                              column.id === "citizen_ngaycap") &&
                            value
                          ) {
                            value = dayjs
                              .utc(value.toString())
                              .format("DD/MM/YYYY");
                          }
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value.toString()}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          <IconButton
                            onClick={() => handleEdit(row.homeOwnerId)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setOpenDialogDetele(true);
                              setSelectedRecord(row.homeOwnerId);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <DeleteRecipientDialog
                            openDialogDelete={openDialogDetele}
                            handleCloseDialogDelete={handleCloseDialogDatele}
                            selectedRecord={selectedRecord}
                            handleDelete={handleDelete}
                          />
                        </TableCell>
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
