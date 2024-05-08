"use client";
import Dashboard from "@/app/components/Dashboard";
import Header from "@/app/components/Header";
import styled from "@emotion/styled";
import {
  Button,
  ButtonProps,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import { HomeContract, Homeowners, Guests, Homes } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

type ContractRent = HomeContract;
type Owner = Homeowners;
type Guest = Guests;
type Home = Homes;

type DataCreateHomeContracts = {
  guestId: number;
  ownerId: number;
  homeId: number;
  duration: number;
  rental: number;
  cycle: number;
  dateRent: Date;
};

export default function AddRent() {
  const router = useRouter();
  const [_owner, setOwner] = useState<Owner>();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [_guest, setGuest] = useState<Guest>();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [homes, setHomes] = useState<Home[]>([]);
  const [InputValueGuest, setInputValueGuest] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [dateStart, setDateStart] = useState<Dayjs | null>(dayjs("2025-01-01"));
  const [dateEnd, setDateEnd] = useState<Dayjs | null>(dayjs("2025-01-01"));

  const [dataCreateHomeContracts, setCreateHomeContracts] =
    useState<DataCreateHomeContracts>({
      guestId: 1,
      ownerId: 1,
      homeId: 1,
      duration: 6,
      rental: 1,
      cycle: 1,
      dateRent: new Date(),
    });

  const initialOwner = owners.length > 0 ? owners[0] : null;
  const initialGuest = guests.length > 0 ? guests[0] : null;

  useEffect(() => {
    axios.get("/api/owner").then(function (response) {
      setOwners(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/api/guest").then(function (response) {
      setGuests(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/api/homes").then(function (response) {
      setHomes(response.data);
    });
  }, []);

  const handleClose = () => {
    router.push("/ListRent");
  };

  const handleSubmit = () => {
    axios
      .post("/api/listRent", dataCreateHomeContracts)
      .then(function (response) {
        // console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .post("/api/homeInvoice", dataCreateHomeContracts)
      .then(function (response) {
        // console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(dataCreateHomeContracts);
  };

  const handleChange = (
    event: SelectChangeEvent,
    value: Owner | Guest | number | string | null,
    name: string | number
  ) => {
    if (typeof value !== "number" && typeof value !== "string") {
      if (name === "owner" && value && "homeOwnerId" in value) {
        setOwner(value as Owner);
        setCreateHomeContracts({
          ...dataCreateHomeContracts,
          ownerId: Number(value?.homeOwnerId),
        });
      } else if (name === "guest" && value && "guestId" in value) {
        setGuest(value as Guest);
        setCreateHomeContracts({
          ...dataCreateHomeContracts,
          guestId: Number(value?.guestId),
        });
      }
    } else {
      setCreateHomeContracts({
        ...dataCreateHomeContracts,
        [name]: value,
      });
    }
  };

  return (
    <Wrapper>
      <Dashboard />
      <WrapperContainer>
        <Header />

        <Paper
          elevation={3}
          sx={{
            // width: "1000px",
            textAlign: "center",
            padding: " 20px 30px",
            margin: "10px",
          }}
        >
          <Typography variant="h5">Thêm hợp đồng thuê nhà mới</Typography>
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
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Address Home
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={dataCreateHomeContracts.homeId}
                    label="Address Home"
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange(
                        e as any,
                        value as Owner | Guest | number | string | null,
                        "homeId"
                      );
                    }}
                  >
                    {homes.map((home) => (
                      <MenuItem key={home.homeId} value={home.homeId}>
                        {home.fullname} - {home.address}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item lg={5}>
              <Item>
                <Autocomplete
                  value={_owner !== null ? _owner : null}
                  size="small"
                  onChange={(e, value) =>
                    handleChange(
                      e as any,
                      value as Owner | Guest | number | string | null,
                      "owner"
                    )
                  }
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  id="controllable-states-demo"
                  options={owners}
                  getOptionKey={(option: { homeOwnerId: number }) =>
                    option.homeOwnerId
                  }
                  getOptionLabel={(option) => option.fullname ?? ""}
                  renderInput={(params) => (
                    <TextField {...params} label="Name of Owner" />
                  )}
                />
              </Item>
            </Grid>
            <Grid item lg={5}>
              <Item>
                <Autocomplete
                  value={_guest !== null ? _guest : null}
                  size="small"
                  onChange={(e, value) =>
                    handleChange(
                      e as any,
                      value as Owner | Guest | number | string | null,
                      "guest"
                    )
                  }
                  inputValue={InputValueGuest}
                  onInputChange={(event, newInputValue) => {
                    setInputValueGuest(newInputValue);
                  }}
                  id="controllable-states-demo"
                  options={guests}
                  getOptionKey={(option: { guestId: number }) => option.guestId}
                  getOptionLabel={(option) => option.fullname ?? ""}
                  renderInput={(params) => (
                    <TextField {...params} label="Name of Guest" />
                  )}
                />
              </Item>
            </Grid>
            <Grid item lg={2.5}>
              <Item>
                <FormControl fullWidth>
                  <InputLabel id="duration-select-label">
                    Thời thạn thuê
                  </InputLabel>
                  <Select
                    labelId="duration-select-label"
                    id="duration-select"
                    value={dataCreateHomeContracts.duration}
                    label="Thời thạn thuê"
                    size="small"
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange(
                        e as any,
                        value as Owner | Guest | number | string | null,
                        "duration"
                      );
                    }}
                  >
                    <MenuItem value={6}>6 tháng</MenuItem>
                    <MenuItem value={12}>1 năm</MenuItem>
                    <MenuItem value={24}>2 năm</MenuItem>
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item lg={2.5}>
              <Item>
                <FormControl fullWidth>
                  <InputLabel id="cycle-select-label1">
                    Chu kỳ thanh toán tiền
                  </InputLabel>
                  <Select
                    labelId="cycle-select-label1"
                    id="cycle-select"
                    value={dataCreateHomeContracts.cycle}
                    label="Chu kỳ thanh toán tiền"
                    size="small"
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange(
                        e as any,
                        value as Owner | Guest | number | string | null,
                        "cycle"
                      );
                    }}
                  >
                    <MenuItem value={1}>1 tháng</MenuItem>
                    <MenuItem value={2}>2 tháng</MenuItem>
                    <MenuItem value={3}>3 tháng</MenuItem>
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item lg={2.5}>
              <Item>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateField"]}>
                    <DateField
                      size="small"
                      label="Ngày nhận nhà"
                      value={dateStart}
                      onChange={(newValue) => setDateStart(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Item>
            </Grid>
            <Grid item lg={2.5}>
              <Item>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateField"]}>
                    <DateField
                      size="small"
                      label="Ngày trả nhà"
                      value={dateEnd}
                      onChange={(newValue) => setDateEnd(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Item>
            </Grid>
            <Grid item lg={5}>
              <Item>
                <TextField
                  margin="dense"
                  id="rental"
                  label="Giá thuê nhà (000 VNĐ/tháng)"
                  type="number"
                  fullWidth
                  size="small"
                  onChange={(e) => {
                    const value = e.target.value; // Extract the value from the event
                    handleChange(
                      e as any,
                      value as Owner | Guest | number | string | null,
                      "rental"
                    );
                  }}
                />
              </Item>
            </Grid>
            <Grid item lg={5}>
              <Item>
                <TextField
                  margin="dense"
                  id="rental"
                  label="Số tiền đặt cọc"
                  type="number"
                  fullWidth
                  size="small"
                  onChange={(e) => {
                    const value = e.target.value; // Extract the value from the event
                    handleChange(
                      e as any,
                      value as Owner | Guest | number | string | null,
                      "rental_o"
                    );
                  }}
                />
              </Item>
            </Grid>
            <Grid item lg={5}>
              <Item>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Thông tin STK người nhận
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={dataCreateHomeContracts.homeId}
                    label="Thông tin STK người nhận"
                    // onChange={(newValue) => setDateEnd(newValue)}
                    // onChange={(e) => {
                    //   const value = e.target.value;
                    //   handleChange(
                    //     e as any,
                    //     value as Owner | Guest | number | string | null,
                    //     "homeId"
                    //   );
                    // }}
                  >
                    {homes.map((home) => (
                      <MenuItem key={home.homeId} value={home.homeId}>
                        {home.fullname} - {home.address}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Item>
            </Grid>
          </Grid>
          <br />
          <Button variant="outlined" size="large" onClick={handleClose}>
            Cancel
          </Button>
          <ColorButton variant="contained" size="large" onClick={handleSubmit}>
            Submit
          </ColorButton>
        </Paper>
        <Paper>
          <Typography variant="h6">Danh sách hóa đơn thanh toán</Typography>
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

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex: 1;
  height: 100hv;
`;
