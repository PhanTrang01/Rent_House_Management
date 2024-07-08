"use client";
import styled from "@emotion/styled";
import Dashboard from "../../components/Dashboard";
import Header from "../../components/Header";
import { useState, useEffect, JSX, useContext } from "react";
import axios from "axios";
import { Guests, HomeContract, Homeowners, Homes } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  Button,
  ButtonProps,
  FilledTextFieldProps,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  OutlinedTextFieldProps,
  Paper,
  Select,
  StandardTextFieldProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TextFieldVariants,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRouter } from "next/navigation";
import { ToastContext } from "@/contexts/ToastContext";

dayjs.extend(utc);

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex-grow: 1;
`;

type ContractInfo = HomeContract & {
  home: Homes & {
    homeowner: Homeowners;
  };
  guest: Guests;
};

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
    | "owner"
    | "apartment"
    | "adress"
    | "duration"
    | "rental"
    | "date_start"
    | "status";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: String) => String;
}

const columns: readonly Column[] = [
  { id: "owner", label: "Tên chủ nhà", minWidth: 150 },
  { id: "apartment", label: "Căn hộ", minWidth: 150 },
  {
    id: "adress",
    label: "Địa chỉ căn hộ",
    minWidth: 250,
  },
  {
    id: "duration",
    label: "Thời hạn thuê",
    minWidth: 60,
  },
  {
    id: "rental",
    label: "Giá thuê",
    minWidth: 80,
  },
  {
    id: "date_start",
    label: "Ngày bắt đầu thuê",
    minWidth: 80,
  },
  {
    id: "status",
    label: "Trạng thái",
    minWidth: 60,
  },
];

export default function StorePage({ params }: { params: { id: string } }) {
  const route = useRouter();
  const { notify } = useContext(ToastContext);

  const [guest, setGuest] = useState<Guests>();
  const [contracts, setContracts] = useState<ContractInfo[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);
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

  // useEffect(() => {
  //   const data = localStorage.getItem('guestData');
  //   if (data) {
  //     setRow(JSON.parse(data));
  //     localStorage.removeItem('guestData'); // Optionally clear the data
  //   }
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/guest/${params.id}`);
        const newGuest: Guests = res.data;

        if (newGuest) {
          setGuest(newGuest);
          const { createdAt, updatedAt, guestId, ...newGuestForm } = newGuest;
          setGuestForm(newGuestForm);
        }
        console.log(guestForm);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchDataContract = async () => {
    try {
      const res = await axios.get(`/api/homeContract?guestId=${params.id}`);
      const newContract: ContractInfo[] = res.data;

      if (newContract.length > 0) {
        setContracts(newContract);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = () => {
    setIsDisabled(false);
  };

  const handleClose = () => {
    setIsDisabled(true);
    window.location.reload();
  };

  const handleSubmit = () => {
    const handleSave = async () => {
      try {
        const response = await axios.put(`/api/guest/${params.id}`, guestForm);
        console.log("Data updated successfully:", response.data);
        notify("success", "Update Successfully");
      } catch (error) {
        console.error("Error saving data:", error);
        notify("error", "Update Failed");
      }
    };
    handleSave();
    route.push("/guest");
  };
  return (
    <Wrapper>
      <Dashboard />
      <WrapperContainer>
        <Header />
        <Paper
          elevation={3}
          sx={{
            textAlign: "center",
            padding: " 20px 30px",
            margin: "10px",
          }}
        >
          <Typography variant="h5">Thông tin khách thuê</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateField"]}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Grid item lg={5}>
                  <Item>
                    <TextField
                      required
                      disabled={isDisabled}
                      id="name"
                      label="Tên khách thuê"
                      type="text"
                      fullWidth
                      value={guestForm.fullname}
                      size="small"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => {
                        setGuestForm({
                          ...guestForm,
                          fullname: e.target.value,
                        });
                      }}
                    />
                  </Item>
                </Grid>

                <Grid item lg={2.5}>
                  <Item>
                    <DateField
                      disabled={isDisabled}
                      fullWidth
                      id="birthday"
                      label="Ngày Sinh"
                      value={dayjs.utc(guestForm.birthday)}
                      size="small"
                      variant="standard"
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
                  </Item>
                </Grid>
                <Grid item lg={2.5}>
                  <Item>
                    <TextField
                      disabled={isDisabled}
                      id="phone"
                      label="Số điện thoại"
                      type="text"
                      fullWidth
                      value={guestForm.phone}
                      size="small"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => {
                        setGuestForm({
                          ...guestForm,
                          phone: e.target.value,
                        });
                      }}
                    />
                  </Item>
                </Grid>
                <Grid item lg={5}>
                  <Item>
                    <TextField
                      disabled={isDisabled}
                      id="email"
                      label="Email"
                      type="text"
                      fullWidth
                      value={guestForm.email}
                      size="small"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => {
                        setGuestForm({
                          ...guestForm,
                          email: e.target.value,
                        });
                      }}
                    />
                  </Item>
                </Grid>
                <Grid item lg={5}>
                  <Item>
                    <TextField
                      disabled={isDisabled}
                      id=""
                      label="Số CCCD"
                      type="text"
                      fullWidth
                      value={guestForm.citizenId}
                      size="small"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => {
                        setGuestForm({
                          ...guestForm,
                          citizenId: e.target.value,
                        });
                      }}
                    />
                  </Item>
                </Grid>
                <Grid item lg={2.5}>
                  <Item>
                    <DateField
                      disabled={isDisabled}
                      fullWidth
                      id="citizen_ngaycap"
                      label="Ngày cấp CCCD"
                      value={dayjs.utc(guestForm.citizen_ngaycap)}
                      size="small"
                      variant="standard"
                      onChange={(newValue) => {
                        if (newValue) {
                          setGuestForm({
                            ...guestForm,
                            citizen_ngaycap: newValue.toDate(),
                          });
                        }
                      }}
                    />
                  </Item>
                </Grid>

                <Grid item lg={2.5}>
                  <Item>
                    <TextField
                      disabled={isDisabled}
                      id="citizen_noicap"
                      label="Nơi cấp CCCD"
                      type="text"
                      fullWidth
                      defaultValue={guestForm.citizen_noicap}
                      size="small"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => {
                        setGuestForm({
                          ...guestForm,
                          citizen_noicap: e.target.value,
                        });
                      }}
                    />
                  </Item>
                </Grid>
                <Grid item lg={5}>
                  <Item>
                    <TextField
                      disabled={isDisabled}
                      id="hometown"
                      label="Quê quán"
                      type="text"
                      fullWidth
                      value={guestForm.hometown}
                      size="small"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => {
                        setGuestForm({
                          ...guestForm,
                          hometown: e.target.value,
                        });
                      }}
                    />
                  </Item>
                </Grid>
                <Grid item lg={10}>
                  <Item>
                    <TextField
                      disabled={isDisabled}
                      id="Note"
                      label="Ghi chú"
                      type="number"
                      value={guest?.Note}
                      fullWidth
                      size="small"
                      variant="standard"
                      multiline
                      maxRows={4}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => {
                        setGuestForm({
                          ...guestForm,
                          Note: e.target.value,
                        });
                      }}
                    />
                  </Item>
                </Grid>
              </Grid>
            </DemoContainer>
          </LocalizationProvider>
          <br />
          <Grid
            container
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{
              textAlign: "right",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid item lg={6}>
              <Button
                hidden={!isDisabled}
                variant="outlined"
                size="large"
                endIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Chỉnh sửa
              </Button>
            </Grid>
            <Grid item lg={4}>
              <Button
                hidden={isDisabled}
                variant="outlined"
                size="large"
                sx={{
                  textAlign: "right",
                }}
                onClick={handleClose}
              >
                Hủy
              </Button>
              <ColorButton
                hidden={isDisabled}
                variant="outlined"
                size="large"
                onClick={handleSubmit}
              >
                Lưu
              </ColorButton>
            </Grid>
          </Grid>
        </Paper>
        <Paper
          sx={{
            textAlign: "center",
            padding: "2px 30px",
            margin: "5px",
          }}
        >
          <Typography variant="h6">Danh sách hợp đồng</Typography>
          <TableContainer sx={{ maxHeight: 400 }}>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {contracts.map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.homeContractsId}
                      onClick={() => {
                        route.push(
                          `/homes/${row.homeId}/homeContract/${row.homeContractsId}`
                        );
                      }}
                    >
                      <TableCell align="left">
                        {row.home.homeowner.fullname}
                      </TableCell>
                      <TableCell align="left">
                        {row.home.apartmentNo} - {row.home.building}
                      </TableCell>
                      <TableCell align="left">
                        {row.home.address} - {row.home.Ward} -{" "}
                        {row.home.District}
                      </TableCell>
                      <TableCell align="center">{row.duration} tháng</TableCell>
                      <TableCell align="center">
                        {row.rental.toLocaleString("en-EN")}
                      </TableCell>
                      <TableCell align="center">
                        {dayjs.utc(row.dateStart).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell align="center">{row.status}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </WrapperContainer>
    </Wrapper>
  );
}

const ColorButton = styled(Button)<ButtonProps>(() => ({
  color: "black",
  backgroundColor: "#a689ff !important",
  margin: "0px 10px",
  "&:hover": {
    backgroundColor: "#a18aae",
    color: "black",
  },
}));

const Item = styled(Paper)(() => ({
  backgroundColor: "#f2e9f8",
  padding: "7px",
  textAlign: "center" as const,
}));
