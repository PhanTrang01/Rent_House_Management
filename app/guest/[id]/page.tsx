"use client";
import styled from "@emotion/styled";
import Dashboard from "../../components/Dashboard";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import { Guests, HomeContract, Homeowners, Homes } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  Button,
  ButtonProps,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
  const [guest, setGuest] = useState<Guests>();
  const [contracts, setContracts] = useState<ContractInfo[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/guest/${params.id}`);
        const newGuest: Guests = res.data;

        if (newGuest) {
          setGuest(newGuest);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
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
    fetchDataContract();
  }, []);

  const handleEdit = () => {
    setIsDisabled(false);
  };

  const handleClose = () => {
    setIsDisabled(true);
  };

  const handleSubmit = () => {};
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
                      //   disabled={isDisabled}
                      margin="dense"
                      id="name"
                      label="Tên khách thuê"
                      type="text"
                      fullWidth
                      defaultValue={guest ? guest.fullname : ""}
                      size="small"
                      variant="standard"
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
                      defaultValue={dayjs.utc(guest?.birthday)}
                      size="small"
                      variant="standard"
                    />
                  </Item>
                </Grid>
                <Grid item lg={2.5}>
                  <Item>
                    <TextField
                      disabled={isDisabled}
                      margin="dense"
                      id="phone"
                      label="Số điện thoại"
                      type="text"
                      fullWidth
                      defaultValue={guest ? guest.phone : ""}
                      size="small"
                      variant="standard"
                    />
                  </Item>
                </Grid>
                <Grid item lg={5}>
                  <Item>
                    <TextField
                      disabled={isDisabled}
                      margin="dense"
                      id="email"
                      label="Email"
                      type="text"
                      fullWidth
                      defaultValue={guest?.email}
                      size="small"
                      variant="standard"
                    />
                  </Item>
                </Grid>
                <Grid item lg={5}>
                  <Item>
                    <TextField
                      disabled={isDisabled}
                      margin="dense"
                      id=""
                      label="Số CCCD"
                      type="text"
                      fullWidth
                      defaultValue={guest?.citizenId}
                      size="small"
                      variant="standard"
                    />
                  </Item>
                </Grid>
                <Grid item lg={5}>
                  <Item>
                    <DateField
                      disabled={isDisabled}
                      fullWidth
                      id="cittizen_ngaycap"
                      label="Ngày cấp CCCD"
                      defaultValue={dayjs.utc(guest?.cittizen_ngaycap)}
                      size="small"
                      variant="standard"
                    />
                  </Item>
                </Grid>

                <Grid item lg={5}>
                  <Item>
                    <TextField
                      disabled={isDisabled}
                      margin="dense"
                      id="cittizen_noicap"
                      label="Nơi cấp CCCD"
                      type="text"
                      fullWidth
                      defaultValue={guest?.cittizen_noicap}
                      size="small"
                      variant="standard"
                    />
                  </Item>
                </Grid>
                <Grid item lg={10}>
                  <Item>
                    <TextField
                      margin="dense"
                      id="Note"
                      label="Ghi chú"
                      type="number"
                      defaultValue={guest?.Note}
                      fullWidth
                      size="small"
                      variant="standard"
                      multiline
                      maxRows={4}
                    />
                  </Item>
                </Grid>
              </Grid>
            </DemoContainer>
          </LocalizationProvider>
          <br />
          <Button variant="outlined" size="large" onClick={handleEdit}>
            Chỉnh sửa
          </Button>
          <Button
            disabled={isDisabled}
            variant="outlined"
            size="large"
            onClick={handleClose}
          >
            Hủy
          </Button>
          <ColorButton
            disabled={isDisabled}
            variant="contained"
            size="large"
            onClick={handleSubmit}
          >
            Lưu
          </ColorButton>
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
                      <TableCell align="center">{row.rental}</TableCell>
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
  backgroundColor: "#bd8cfe",
  margin: "0px 10px",
  "&:hover": {
    backgroundColor: "#cfe0fa",
  },
}));

const Item = styled(Paper)(() => ({
  backgroundColor: "#f5f5fb",
  padding: "7px",
  textAlign: "center",
}));
