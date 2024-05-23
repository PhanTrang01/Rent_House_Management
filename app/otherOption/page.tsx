"use client";
import styled from "@emotion/styled";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { Receiver, Service } from "@prisma/client";
import axios from "axios";
import DeleteRecipientDialog from "../components/DialogWarnning";

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex-grow: 1;
`;
//Bang dich vu
interface Column {
  id: "serviceId" | "name" | "unit" | "description";
  label: string;
  minWidth?: number;
  align?: "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "serviceId", label: "Mã dịch vụ", minWidth: 40, align: "center" },
  { id: "name", label: "Tên dịch vụ", minWidth: 170, align: "center" },
  {
    id: "unit",
    label: "Đơn vị tính",
    minWidth: 100,
    align: "center",
  },
  {
    id: "description",
    label: "Mô tả",
    minWidth: 270,
    align: "center",
    // format: (value: number) => value.toLocaleString("en-US"),
  },
];

//Bang nguoi nhan
interface ColumnReceiver {
  id: "name" | "phone" | "email" | "taxcode" | "STK" | "TenTK" | "Nganhang";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columnReceivers: readonly ColumnReceiver[] = [
  { id: "name", label: "Tên chủ TK", minWidth: 150 },
  { id: "phone", label: "Số Điện thoại", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 150 },
  { id: "taxcode", label: "Mã số thuế", minWidth: 150 },
  {
    id: "STK",
    label: "Số tài khoản",
    minWidth: 170,
    align: "right",
  },
  {
    id: "TenTK",
    label: "Tên tài khoản",
    minWidth: 170,
    align: "right",
  },
  {
    id: "Nganhang",
    label: "Tên ngân hàng",
    minWidth: 170,
    align: "right",
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

export default function OtherOption() {
  const [option, setOption] = useState(0);
  const [searchVal, setSearchval] = useState<String>("");
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [openDialogDetele1, setOpenDialogDetele1] = useState(false);
  const [openDialogDetele2, setOpenDialogDetele2] = useState(false);
  const [selectedRecord1, setSelectedRecord1] = useState<number | null>(null);
  const [selectedRecord2, setSelectedRecord2] = useState<number | null>(null);
  const [dataServices, setDataServices] = useState<Service[]>([]);
  const [dataReceivers, setDataReceivers] = useState<Receiver[]>([]);
  const [service, setService] = useState<Service>({
    serviceId: 0,
    name: "",
    unit: "",
    description: "",
  });
  const [receiver, setReceiver] = useState<Receiver>({
    receiverId: 0,
    name: "",
    phone: "",
    email: "",
    taxcode: "",
    STK: "",
    TenTK: "",
    Nganhang: "",
    type: "",
    note: "",
  });

  const handleEdit = (id: Number) => {};
  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`/api/serviceO/${id}`);
      // console.log("Data deleted successfully:", response.data);
      // Update the state or perform necessary actions to reflect the deletion
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    window.location.reload(); // Consider updating state instead of reloading the page
  };
  const handleDelete2 = async (id: number) => {
    try {
      const response = await axios.delete(`/api/receiver/${id}`);
      console.log("Data deleted successfully:", response.data);
      // Update the state or perform necessary actions to reflect the deletion
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    window.location.reload(); // Consider updating state instead of reloading the page
  };

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClickOpenDialogDatele1 = () => {
    setOpenDialogDetele1(true);
  };

  const handleClickOpenDialogDatele2 = () => {
    setOpenDialogDetele2(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
    setSelectedRecord1(null);
  };
  const handleClose2 = () => {
    setOpen2(false);
    setSelectedRecord2(null);
  };
  const handleCloseDialogDatele1 = () => {
    setOpenDialogDetele1(false);
    setSelectedRecord1(null);
  };
  const handleCloseDialogDatele2 = () => {
    setOpenDialogDetele2(false);
    setSelectedRecord2(null);
  };

  const handleSubmit1 = () => {
    setOpen1(false);
    const handleSave = async () => {
      try {
        const response = await axios.post("/api/serviceO", service);
        console.log("Data saved successfully:", response.data);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };
    handleSave();
    window.location.reload();
  };

  const handleSubmit2 = () => {
    setOpen2(false);
    const handleSave = async () => {
      try {
        const response = await axios.post("/api/receiver", receiver);
        console.log("Data saved successfully:", response.data);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };
    handleSave();
    window.location.reload();
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setOption(newValue);
  };

  React.useEffect(() => {
    axios.get("/api/serviceO").then(function (response) {
      setDataServices(response.data);
    });

    axios.get("/api/receiver").then(function (response) {
      setDataReceivers(response.data);
    });
  }, []);

  return (
    <Wrapper>
      <Dashboard />
      <WrapperContainer>
        <Header />
        <Paper>
          <Typography variant="h5" sx={{ margin: "15px" }}>
            Danh mục hệ thống
          </Typography>
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                maxWidth: "100%",
                margin: "10px 50px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <TextField
                sx={{
                  width: 400,
                  margin: "0 10px",
                }}
                size="small"
                label="Tìm kiếm hợp đồng"
                id="search"
                onChange={(e) => {
                  setSearchval(e.target.value);
                }}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<SearchIcon />}
                >
                  Tìm kiếm
                </Button>

                <ColorButton
                  hidden={option !== 0}
                  variant="contained"
                  size="small"
                  endIcon={<AddIcon />}
                  onClick={handleClickOpen1}
                >
                  Thêm dịch vụ
                </ColorButton>
                <ColorButton
                  hidden={option !== 1}
                  variant="contained"
                  size="small"
                  endIcon={<AddIcon />}
                  onClick={handleClickOpen2}
                >
                  {" "}
                  Thêm người nhận
                </ColorButton>
              </Stack>
            </Box>
            <Dialog open={open1} onClose={handleClose1}>
              <DialogTitle>
                {selectedRecord1 === null
                  ? "Thêm thông tin dịch vụ"
                  : "Chỉnh sửa thông tin dịch vụ"}{" "}
              </DialogTitle>
              <DialogContent>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Tên dịch vụ"
                  type="text"
                  defaultValue={selectedRecord1 === null ? "" : service?.name}
                  fullWidth
                  onChange={(e) => {
                    setService({ ...service, name: e.target.value });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="unit"
                  label="Đơn vị tính"
                  type="text"
                  defaultValue={selectedRecord1 === null ? "" : service?.unit}
                  fullWidth
                  onChange={(e) => {
                    setService({ ...service, unit: e.target.value });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="description"
                  label="Mô tả"
                  type="text"
                  defaultValue={
                    selectedRecord1 === null ? "" : service?.description
                  }
                  fullWidth
                  onChange={(e) => {
                    setService({ ...service, description: e.target.value });
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose1}>Hủy</Button>
                <Button onClick={handleSubmit1}>Lưu</Button>
              </DialogActions>
            </Dialog>
            <Dialog open={open2} onClose={handleClose2}>
              <DialogTitle>
                {selectedRecord2 === null
                  ? "Thêm thông tin người nhận"
                  : "Chỉnh sửa thông tin người nhận"}
              </DialogTitle>
              <DialogContent>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Tên người nhận"
                  type="text"
                  defaultValue={selectedRecord2 === null ? "" : receiver.name}
                  fullWidth
                  onChange={(e) => {
                    setReceiver({ ...receiver, name: e.target.value });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="phone"
                  label="Số điện thoại"
                  type="text"
                  defaultValue={selectedRecord2 === null ? "" : receiver.phone}
                  fullWidth
                  onChange={(e) => {
                    setReceiver({ ...receiver, phone: e.target.value });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="email"
                  label="Email"
                  type="email"
                  defaultValue={selectedRecord2 === null ? "" : receiver.email}
                  fullWidth
                  onChange={(e) => {
                    setReceiver({ ...receiver, email: e.target.value });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="taxcode"
                  label="Mã số thuế"
                  type="text"
                  defaultValue={
                    selectedRecord2 === null ? "" : receiver.taxcode
                  }
                  fullWidth
                  onChange={(e) => {
                    setReceiver({ ...receiver, taxcode: e.target.value });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="STK"
                  label="Số tài khoản"
                  type="text"
                  defaultValue={selectedRecord2 === null ? "" : receiver.STK}
                  fullWidth
                  onChange={(e) => {
                    setReceiver({ ...receiver, STK: e.target.value });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="TenTK"
                  label="Tên Tài khoản"
                  type="text"
                  defaultValue={selectedRecord2 === null ? "" : receiver.TenTK}
                  fullWidth
                  onChange={(e) => {
                    setReceiver({ ...receiver, TenTK: e.target.value });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="Nganhang"
                  label="Tên Ngân hàng"
                  type="text"
                  defaultValue={
                    selectedRecord2 === null ? "" : receiver.Nganhang
                  }
                  fullWidth
                  onChange={(e) => {
                    setReceiver({ ...receiver, Nganhang: e.target.value });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="note"
                  label="Ghi chú"
                  type="text"
                  defaultValue={selectedRecord2 === null ? "" : receiver.note}
                  fullWidth
                  onChange={(e) => {
                    setReceiver({ ...receiver, note: e.target.value });
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose2}>Hủy</Button>
                <Button onClick={handleSubmit2}>Lưu</Button>
              </DialogActions>
            </Dialog>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={option}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Dịch vụ" tabIndex={0} />
                <Tab label="Người nhận thanh toán" tabIndex={1} />
              </Tabs>
            </Box>
            <CustomTabPanel value={Number(option)} index={0}>
              <Paper>
                <TableContainer sx={{ maxHeight: 580 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align="center"
                            style={{
                              minWidth: column.minWidth,
                              backgroundColor: "#c6c8da",
                            }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                        <TableCell
                          align="center"
                          style={{
                            minWidth: "120",
                            backgroundColor: "#c6c8da",
                          }}
                        >
                          {" "}
                          Hành Động
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataServices
                        //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.serviceId}
                            >
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {value}
                                  </TableCell>
                                );
                              })}
                              <TableCell align="center">
                                <IconButton
                                  onClick={() => handleEdit(row.serviceId)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => {
                                    setOpenDialogDetele1(true);
                                    setSelectedRecord1(row.serviceId);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                                <DeleteRecipientDialog
                                  openDialogDelete={openDialogDetele1}
                                  handleCloseDialogDelete={
                                    handleCloseDialogDatele1
                                  }
                                  selectedRecord={selectedRecord1}
                                  handleDelete={handleDelete}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </CustomTabPanel>
            <CustomTabPanel value={Number(option)} index={1}>
              <Paper>
                <TableContainer sx={{ maxHeight: 580 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columnReceivers.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{
                              minWidth: column.minWidth,
                              backgroundColor: "#c6c8da",
                            }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                        <TableCell
                          align="center"
                          style={{
                            minWidth: "120",
                            backgroundColor: "#c6c8da",
                          }}
                        >
                          {" "}
                          Hành Động
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataReceivers
                        //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.receiverId}
                            >
                              {columnReceivers.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {value}
                                  </TableCell>
                                );
                              })}
                              <TableCell align="center">
                                {/* <IconButton
                                // onClick={() => handleEdit(row.serviceId)}
                                >
                                  <EditIcon />
                                </IconButton> */}
                                <IconButton
                                  onClick={() => {
                                    setOpenDialogDetele2(true);
                                    setSelectedRecord2(row.receiverId);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                                <DeleteRecipientDialog
                                  openDialogDelete={openDialogDetele2}
                                  handleCloseDialogDelete={
                                    handleCloseDialogDatele2
                                  }
                                  selectedRecord={selectedRecord2}
                                  handleDelete={handleDelete2}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </CustomTabPanel>
          </Box>
        </Paper>
      </WrapperContainer>
    </Wrapper>
  );
}

const ColorButton = styled(Button)<ButtonProps>(() => ({
  color: "black",
  backgroundColor: "#cdbff8 !important",
  margin: "0px 10px",
  "&:hover": {
    backgroundColor: "#d0aee3",
    color: "black",
  },
}));
