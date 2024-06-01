"use client";
import styled from "@emotion/styled";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import axios from "axios";
import { Guests } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import DeleteRecipientDialog from "../components/DialogWarnning";

dayjs.extend(utc);

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex-grow: 1;
`;

type GuestForm = {
  fullname: string;
  phone: string;
  birthday: Date;
  citizenId: string;
  citizen_ngaycap: Date;
  citizen_noicap: String;
  email: String;
  hometown: String;
  Note: String | null;
};

interface Column {
  id:
    | "fullname"
    | "phone"
    | "email"
    | "citizenId"
    | "citizen_ngaycap"
    | "citizen_noicap";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: String) => String;
}

const columns: readonly Column[] = [
  { id: "fullname", label: "Tên chủ nhà", minWidth: 170 },
  { id: "phone", label: "Số Điện thoại", minWidth: 100 },
  {
    id: "email",
    label: "Email",
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
];

export default function Guest() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [guests, setGuests] = useState<Guests[]>([]);
  const [value, setValue] = useState<Dayjs | null>();
  const [openDialogDetele, setOpenDialogDetele] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);

  const [guestForm, setGuestForm] = useState<GuestForm>({
    fullname: "",
    phone: "",
    birthday: new Date(),
    citizenId: "",
    citizen_ngaycap: new Date(),
    citizen_noicap: "",
    hometown: "",
    email: "",
    Note: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/guest");
        const newGuest = res.data;
        if (newGuest) {
          setGuests(newGuest);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    setOpen(false);
    console.log(guestForm);
    const handleSave = async () => {
      try {
        const response = await axios.post("/api/guest", guestForm);
        console.log("Data saved successfully:", response.data);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };
    handleSave();
    window.location.reload();
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`/api/guest/${id}`)
      .then(function (response) {
        window.location.reload();
      })
      .catch(function (error) {
        console.error("Error delete guest data:", error);
      });
  };

  const handleCloseDialogDatele = () => {
    setOpenDialogDetele(false);
    setSelectedRecord(null);
  };

  return (
    <Wrapper>
      <Dashboard />
      <WrapperContainer>
        <Header />
        <Paper>
          <Typography variant="h5" sx={{ margin: "15px" }}>
            Danh sách khách thuê
          </Typography>
          <Button
            sx={{ position: "absolute", right: "20px" }}
            variant="outlined"
            onClick={handleClickOpen}
          >
            Thêm thông tin khách thuê
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle> Thêm thông tin khách thuê</DialogTitle>
            <DialogContent>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="fullname"
                  label="Tên khách thuê"
                  type="text"
                  fullWidth
                  onChange={(e) => {
                    setGuestForm({
                      ...guestForm,
                      fullname: e.target.value,
                    });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="phone"
                  label="Số điện thoại"
                  type="text"
                  fullWidth
                  onChange={(e) => {
                    setGuestForm({
                      ...guestForm,
                      phone: e.target.value,
                    });
                  }}
                />
                <DemoContainer components={["DateField"]}>
                  <DateField
                    fullWidth
                    id="birthday"
                    label="Ngày Sinh"
                    onChange={(newValue) => {
                      if (newValue) {
                        const temp = newValue?.toDate();
                        setGuestForm({
                          ...guestForm,
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
                  fullWidth
                  onChange={(e) => {
                    setGuestForm({
                      ...guestForm,
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
                  fullWidth
                  onChange={(e) => {
                    setGuestForm({
                      ...guestForm,
                      citizenId: e.target.value,
                    });
                  }}
                />
                <DemoContainer components={["DateField"]}>
                  <DateField
                    fullWidth
                    id="citizen_ngaycap"
                    label="Ngày cấp CCCD"
                    // value={value}
                    // onChange={(newValue) => setValue(newValue)}
                    onChange={(newValue) => {
                      if (newValue) {
                        const temp = newValue?.toDate();
                        setGuestForm({
                          ...guestForm,
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
                  fullWidth
                  onChange={(e) => {
                    setGuestForm({
                      ...guestForm,
                      citizen_noicap: e.target.value,
                    });
                  }}
                />
                <TextField
                  margin="dense"
                  id="hometown"
                  label="Quê quán"
                  type="text"
                  fullWidth
                  onChange={(e) => {
                    setGuestForm({
                      ...guestForm,
                      hometown: e.target.value,
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
                    setGuestForm({
                      ...guestForm,
                      Note: e.target.value,
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
                  {guests
                    //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.guestId}
                          onClick={() => {
                            localStorage.setItem(
                              "guestData",
                              JSON.stringify(row)
                            );
                            router.push(`/guest/${row.guestId}`);
                          }}
                        >
                          {columns.map((column) => {
                            let value: string | Date | boolean = row[column.id];

                            if (column.id === "citizen_ngaycap" && value) {
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
                          <TableCell align="center">
                            <IconButton
                            // onClick={() => handleEdit(row.serviceId)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setOpenDialogDetele(true);
                                setSelectedRecord(row.guestId);
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
            {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={owners.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
          </Paper>
        </Paper>
      </WrapperContainer>
    </Wrapper>
  );
}
