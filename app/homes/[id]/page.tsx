"use client";
import styled from "@emotion/styled";
import Dashboard from "../../components/Dashboard";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Guests,
  HomeContract,
  Homeowners,
  Homes,
  StatusContract,
} from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  Alert,
  Autocomplete,
  Button,
  ButtonProps,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FilledTextFieldProps,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedTextFieldProps,
  Paper,
  Select,
  StandardTextFieldProps,
  Switch,
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

dayjs.extend(utc);

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex-grow: 1;
`;
type HomeInfo = Homes & {
  owner: Homeowners;
};

type ContractInfo = HomeContract & {
  home: Homes & {
    homeowner: Homeowners;
  };
  guest: Guests;
};

type HomeForm = {
  homeOwnerId: number | null;
  address: string;
  building: string | null;
  apartmentNo: string;
  Ward: string;
  District: string;
  Province: string;
  active: boolean;
  Note: string | null;
};

type ContractForm = {
  homeId: number | null;
  guestId: number | null;
  duration: number;
  payCycle: number | null;
  rental: number;
  deposit: number;
  dateStart: Date;
  dateEnd: Date;
  status: StatusContract;
};
interface Column {
  id:
    | "owner"
    | "guest"
    | "duration"
    | "rental"
    | "date_start"
    | "deposit"
    | "status";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: String) => String;
}

const columns: readonly Column[] = [
  { id: "owner", label: "Tên chủ nhà", minWidth: 150 },
  { id: "guest", label: "Tên khách thuê", minWidth: 150 },

  {
    id: "duration",
    label: "Thời hạn thuê",
    minWidth: 60,
  },
  {
    id: "deposit",
    label: "Số tiền cọc (VND)",
    minWidth: 100,
  },
  {
    id: "rental",
    label: "Giá thuê (VND/tháng)",
    minWidth: 100,
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
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const [home, setHome] = useState<HomeInfo>();
  const [contracts, setContracts] = useState<ContractInfo[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [owner, setOwner] = useState<Homeowners | null>(null);
  const [owners, setOwners] = useState<Homeowners[]>([]);
  const [inputValueOwner, setInputValueOwner] = useState("");

  const [homeForm, setHomeForm] = useState<HomeForm>({
    homeOwnerId: null,
    address: "",
    building: "",
    apartmentNo: "",
    Ward: "",
    District: "",
    Province: "",
    active: true,
    Note: null,
  });

  const [open, setOpen] = useState(false);
  const [openWarn, setOpenWarn] = useState(false);
  const [guests, setGuests] = useState<Guests[]>([]);
  const [guest, setGuest] = useState<Guests | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [contractForm, setContractForm] = useState<ContractForm>({
    homeId: null,
    guestId: null,
    duration: 6,
    payCycle: 1,
    rental: 0,
    deposit: 0,
    dateStart: new Date(),
    dateEnd: new Date(),
    status: StatusContract.ACTIVE,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/homes/${params.id}`);
        const newHome: HomeInfo = res.data;
        if (newHome) {
          setHome(newHome);
          setOwner(newHome.owner);
          const { createdAt, updatedAt, homeId, owner, ...newHomeForm } =
            newHome;
          setHomeForm(newHomeForm);
          setInputValueOwner(
            newHome.owner
              ? `${newHome.owner.fullname} - ${newHome.owner.citizenId}`
              : ""
          );
        }

        const ownerRes = await axios.get("/api/owner");
        setOwners(ownerRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  // useEffect(() => {
  //   axios.get("/api/owner").then(function (response) {
  //     setOwners(response.data);
  //   });
  // }, []);

  const fetchDataContract = async () => {
    try {
      const res = await axios.get(`/api/homeContract?homeId=${params.id}`);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/guest`);
        setGuests(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = () => {
    setIsDisabled(false);
  };

  const handleCancel = () => {
    setIsDisabled(true);
    window.location.reload();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitEdit = () => {
    const handleSave = async () => {
      try {
        const response = await axios.put(`/api/homes`, {
          ...homeForm,
          _homeId: params.id,
        });
        console.log("Data updated successfully:", response.data);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };
    handleSave();
    window.location.reload();
  };

  const handleSubmitContract = () => {
    const handleSave = async () => {
      try {
        const response = await axios.post(`/api/homeContract`, {
          ...contractForm,
          homeId: params.id,
        });
        console.log("Data updated successfully:", response.data);
        window.location.reload();
      } catch (error) {
        console.error("Error saving data:", error);
        if (axios.isAxiosError(error)) {
          // Kiểm tra xem lỗi có phải là lỗi 400 không
          if (
            error.response &&
            error.response.status === 400 &&
            error.response.data.error
          ) {
            setOpen(false);
            setOpenWarn(true);
          }
        }
      }
    };

    handleSave();
  };

  if (loading) {
    return <CircularProgress />;
  }

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
            // margin: "10px",
          }}
        >
          <Alert hidden={!openWarn} severity="error">
            Căn hộ đang cho thuê không thể tạo hợp đồng mới. Vui lòng kiểm tra
            lại
          </Alert>
          <div style={{ display: "flex", textAlign: "center", width: "100%" }}>
            <IconButton
              onClick={() => {
                router.push("/homes");
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ flex: "1" }}>
              Thông tin Căn hộ
            </Typography>
          </div>
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
            <Grid item lg={10}>
              <Item>
                <Autocomplete
                  disabled={isDisabled}
                  size="small"
                  value={owner}
                  onChange={(event: any, newValue: Homeowners | null) => {
                    if (newValue) {
                      setOwner(newValue);
                      setHomeForm({
                        ...homeForm,
                        homeOwnerId: Number(newValue.homeOwnerId),
                      });
                    }
                  }}
                  inputValue={inputValueOwner}
                  onInputChange={(event, newInputValue) => {
                    setInputValueOwner(newInputValue);
                  }}
                  id="controllable-owner"
                  options={owners}
                  getOptionKey={(option: { homeOwnerId: number }) =>
                    option.homeOwnerId
                  }
                  getOptionLabel={(option) =>
                    `${option.fullname} - ${option.citizenId}` ?? ""
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.homeOwnerId === value?.homeOwnerId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chủ Căn hộ"
                      variant="standard"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </Item>
            </Grid>
            <Grid item lg={4}>
              <Item>
                <TextField
                  required
                  disabled={isDisabled}
                  id="building"
                  label="Tên tòa nhà"
                  type="text"
                  fullWidth
                  value={homeForm.building}
                  size="small"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setHomeForm({
                      ...homeForm,
                      building: e.target.value,
                    });
                  }}
                />
              </Item>
            </Grid>
            <Grid item lg={4}>
              <Item>
                <TextField
                  disabled={isDisabled}
                  id="apartmentNo"
                  label="Căn hộ số"
                  type="text"
                  fullWidth
                  value={homeForm.apartmentNo}
                  size="small"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setHomeForm({
                      ...homeForm,
                      apartmentNo: e.target.value,
                    });
                  }}
                />
              </Item>
            </Grid>
            <Grid item lg={2}>
              <Item>
                <FormControlLabel
                  control={
                    <Switch
                      disabled={isDisabled}
                      checked={homeForm.active}
                      onChange={(e) => {
                        setHomeForm({
                          ...homeForm,
                          active: e.target.checked,
                        });
                      }}
                      color="secondary"
                    />
                  }
                  label="Trạng thái sẵn sàng"
                  labelPlacement="start"
                />
              </Item>
            </Grid>
            <Grid item lg={2.5}>
              <Item>
                <TextField
                  disabled={isDisabled}
                  id="address"
                  label="Địa chỉ"
                  type="text"
                  fullWidth
                  value={homeForm.address}
                  size="small"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setHomeForm({
                      ...homeForm,
                      address: e.target.value,
                    });
                  }}
                />
              </Item>
            </Grid>
            <Grid item lg={2.5}>
              <Item>
                <TextField
                  disabled={isDisabled}
                  id="Ward"
                  label="Phường/xã"
                  type="text"
                  fullWidth
                  value={homeForm.Ward}
                  size="small"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setHomeForm({
                      ...homeForm,
                      Ward: e.target.value,
                    });
                  }}
                />
              </Item>
            </Grid>
            <Grid item lg={2.5}>
              <Item>
                <TextField
                  disabled={isDisabled}
                  id="District"
                  label="Quận/huyện"
                  type="text"
                  fullWidth
                  value={homeForm.District}
                  size="small"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setHomeForm({
                      ...homeForm,
                      District: e.target.value,
                    });
                  }}
                />
              </Item>
            </Grid>
            <Grid item lg={2.5}>
              <Item>
                <TextField
                  disabled={isDisabled}
                  id="Province"
                  label="Tỉnh/Thành phố"
                  type="text"
                  fullWidth
                  value={homeForm.Province}
                  size="small"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setHomeForm({
                      ...homeForm,
                      Province: e.target.value,
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
                  type="text"
                  fullWidth
                  value={homeForm.Note || ""}
                  size="small"
                  variant="standard"
                  multiline
                  maxRows={4}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setHomeForm({
                      ...homeForm,
                      Note: e.target.value,
                    });
                  }}
                />
              </Item>
            </Grid>
          </Grid>
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
                onClick={handleCancel}
              >
                Hủy
              </Button>
              <ColorButton
                hidden={isDisabled}
                variant="outlined"
                size="large"
                onClick={handleSubmitEdit}
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
            // margin: "5px",
          }}
        >
          <div style={{ display: "flex", textAlign: "center", width: "100%" }}>
            <Typography sx={{ flex: "1" }} variant="h6">
              Danh sách hợp đồng căn hộ
            </Typography>
            <Button
              sx={{ textAlign: "right", margin: "5px" }}
              variant="outlined"
              onClick={() => {
                setOpen(true);
                // router.push(`/homes/${params.id}/homeContract`);
              }}
            >
              Thêm mới hợp đồng căn hộ
            </Button>
            <Dialog open={open} scroll="paper">
              <DialogTitle>Tạo Hợp đồng Căn hộ</DialogTitle>
              <DialogContent dividers>
                <TextField
                  disabled
                  autoFocus
                  margin="dense"
                  id="apartment"
                  label="Căn hộ"
                  type="text"
                  value={`${home?.apartmentNo} - ${home?.building}`}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  disabled
                  margin="dense"
                  id="address"
                  label="Địa chỉ"
                  type="text"
                  value={`${home?.address} - ${home?.Ward} - ${home?.District} - ${home?.Province}`}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Autocomplete
                  value={guest !== null ? guest : null}
                  onChange={(event: any, newValue: Guests | null) => {
                    if (newValue) {
                      setGuest(newValue);
                      setContractForm({
                        ...contractForm,
                        guestId: Number(newValue.guestId),
                      });
                    }
                  }}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  id="controllable-guest"
                  options={guests}
                  getOptionKey={(option: { guestId: number }) => option.guestId}
                  getOptionLabel={(option) =>
                    `${option.fullname} - ${option.citizenId}` ?? ""
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Khách thuê" />
                  )}
                />

                <TextField
                  required
                  margin="dense"
                  id="duration"
                  label="Thời hạn thuê (Tháng)"
                  type="number"
                  fullWidth
                  onChange={(e) => {
                    setContractForm({
                      ...contractForm,
                      duration: Number(e.target.value),
                    });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="payCycle"
                  label="Chu kỳ thanh toán (tháng)"
                  type="number"
                  fullWidth
                  onChange={(e) => {
                    setContractForm({
                      ...contractForm,
                      payCycle: Number(e.target.value),
                    });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="rental"
                  label="Giá thuê (VND/tháng)"
                  type="number"
                  fullWidth
                  inputProps={{
                    min: 0, // Đặt giá trị tối thiểu là 0 nếu cần
                    step: 10000, // Đặt bước nhảy (step)
                  }}
                  onChange={(e) => {
                    setContractForm({
                      ...contractForm,
                      rental: Number(e.target.value),
                    });
                  }}
                />
                <TextField
                  required
                  margin="dense"
                  id="deposit"
                  label="Tiền cọc (VND)"
                  type="number"
                  fullWidth
                  inputProps={{
                    min: 0, // Đặt giá trị tối thiểu là 0 nếu cần
                    step: 10000, // Đặt bước nhảy (step)
                  }}
                  onChange={(e) => {
                    setContractForm({
                      ...contractForm,
                      deposit: Number(e.target.value),
                    });
                  }}
                />
                {/* -------------------------- Sửa thành Date Picker */}
                <TextField
                  id="dateStart"
                  label="Ngày bắt đầu"
                  type="date"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setContractForm({
                      ...contractForm,
                      dateStart: new Date(e.target.value),
                    });
                  }}
                />
                <TextField
                  id="dateEnd"
                  label="Ngày kết thúc"
                  type="date"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setContractForm({
                      ...contractForm,
                      dateEnd: new Date(e.target.value),
                    });
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={handleSubmitContract}>Lưu</Button>
              </DialogActions>
            </Dialog>
          </div>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow hover>
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
                        router.push(
                          `/homes/${row.homeId}/homeContract/${row.homeContractsId}`
                        );
                      }}
                    >
                      <TableCell align="left">
                        {row.home.homeowner?.fullname}
                      </TableCell>
                      <TableCell align="left">{row.guest.fullname}</TableCell>
                      <TableCell align="left">{row.duration} tháng</TableCell>
                      <TableCell align="center">
                        {row.deposit.toLocaleString("en-EN")}{" "}
                      </TableCell>
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
  backgroundColor: "#c5b9f2 !important",
  margin: "0px 10px",
  "&:hover": {
    backgroundColor: "#b3a5bb",
    color: "black",
  },
}));

const Item = styled(Paper)(() => ({
  backgroundColor: "#fcfafd",
  padding: "5px",
  //   textAlign: "center",
}));
