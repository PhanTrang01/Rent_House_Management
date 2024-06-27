"use client";
import React, { useState, useEffect, useContext } from "react";
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
import { ToastContext } from "@/contexts/ToastContext";

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
  homeOwnerId: number | null;
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
  Note: String | null;
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
  const { notify } = useContext(ToastContext);

  const [page, setPage] = React.useState(0);
  const [openDialogDetele, setOpenDialogDetele] = useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [owners, setOwners] = React.useState<Owner[]>([]);
  const [owner, setOwner] = React.useState<Owner>();
  const [open, setOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [value, setValue] = React.useState<Dayjs | null>();

  const [dataCreateOwner, setCreateOwner] = React.useState<CreateOwner>({
    homeOwnerId: null,
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
    Note: null,
  });

  const handleEdit = (id: number) => {
    setSelectedRecord(id);
    axios
      .get(`/api/owner/${id}`)
      .then(function (response) {
        setOwner(response.data);
        setCreateOwner({
          ...dataCreateOwner,
          homeOwnerId: id,
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
          Note: response.data.Note,
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
        notify("success", "Create successfully");
        window.location.reload();
      })
      .catch(function (error) {
        const errorMessage = error.response.data.message;
        notify("error", "Creating has a error");
      });
  };
  const handleSubmitUpdate = () => {
    setOpen(false);
    console.log(dataCreateOwner);
    axios
      .put("/api/owner", dataCreateOwner)
      .then(function (response) {
        console.log(dataCreateOwner);
        notify("success", "Update successfully");
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateField"]}>
              <DialogContent>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Tên chủ nhà"
                  type="text"
                  defaultValue={dataCreateOwner?.name}
                  fullWidth
                  onChange={(e) => {
                    setCreateOwner({
                      ...dataCreateOwner,
                      name: e.target.value,
                    });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="phone"
                  label="Số điện thoại"
                  type="text"
                  defaultValue={
                    selectedRecord === null ? "" : dataCreateOwner?.phone
                  }
                  fullWidth
                  onChange={(e) => {
                    setCreateOwner({
                      ...dataCreateOwner,
                      phone: e.target.value,
                    });
                  }}
                />

                <DateField
                  fullWidth
                  id="birthday"
                  label="Ngày Sinh"
                  value={dayjs.utc(dataCreateOwner?.birthday)}
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

                <TextField
                  required
                  margin="dense"
                  id="email"
                  label="Email"
                  type="email"
                  defaultValue={dataCreateOwner?.email}
                  fullWidth
                  onChange={(e) => {
                    setCreateOwner({
                      ...dataCreateOwner,
                      email: e.target.value,
                    });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="citizen"
                  label="Số CCCD"
                  type="text"
                  defaultValue={dataCreateOwner?.citizenId}
                  fullWidth
                  onChange={(e) => {
                    setCreateOwner({
                      ...dataCreateOwner,
                      citizenId: e.target.value,
                    });
                  }}
                />

                <DateField
                  fullWidth
                  id="citizen_ngaycap"
                  label="Ngày cấp CCCD"
                  value={dayjs.utc(dataCreateOwner?.citizen_ngaycap)}
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

                <TextField
                  required
                  margin="dense"
                  id="citizen_noicap"
                  label="Nơi cấp CCCD"
                  type="text"
                  defaultValue={dataCreateOwner?.citizen_noicap}
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
                  defaultValue={
                    selectedRecord === null ? "" : dataCreateOwner?.STK
                  }
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
                  defaultValue={
                    selectedRecord === null ? "" : dataCreateOwner?.TenTK
                  }
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
                  defaultValue={
                    selectedRecord === null ? "" : dataCreateOwner?.bank
                  }
                  fullWidth
                  onChange={(e) => {
                    setCreateOwner({
                      ...dataCreateOwner,
                      bank: e.target.value,
                    });
                  }}
                />
                <TextField
                  margin="dense"
                  id="Note"
                  label="Ghi chú"
                  type="text"
                  fullWidth
                  onChange={(e) => {
                    setCreateOwner({
                      ...dataCreateOwner,
                      Note: e.target.value,
                    });
                  }}
                />
              </DialogContent>
            </DemoContainer>
          </LocalizationProvider>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            {selectedRecord === null ? (
              <Button onClick={handleSubmit}>Lưu</Button>
            ) : (
              <Button onClick={handleSubmitUpdate}>Lưu thay đổi</Button>
            )}
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
                  <TableCell> Hành động</TableCell>
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
                            message="Xác nhận xóa thông tin chủ nhà đã chọn"
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
