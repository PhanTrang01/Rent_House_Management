"use client";
import styled from "@emotion/styled";
import Dashboard from "../../components/Dashboard";
import Header from "../../components/Header";
import { useState, useEffect, useContext } from "react";
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
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { ToastContext } from "@/contexts/ToastContext";
import DeleteRecipientDialog from "@/app/components/DialogWarnning";

dayjs.extend(utc);

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex-grow: 1;
`;
type HomeInfo = Homes & {
  homeowner: Homeowners;
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
  const { notify } = useContext(ToastContext);

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

  const [selectedHomeContract, setSelectedHomeContract] = useState<
    number | null
  >(null);
  const [openDialogDeteleHomeContract, setOpenDialogDeteleHomeContract] =
    useState(false);
  const [ownerName, setOwnerName] = useState<String>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/homes/${params.id}`);
        const newHome: HomeInfo = res.data;
        if (newHome) {
          console.log("124", newHome.homeowner);
          setHome(newHome);
          setOwner(newHome.homeowner);
          const { createdAt, updatedAt, homeId, homeowner, ...newHomeForm } =
            newHome;
          setHomeForm(newHomeForm);
          setInputValueOwner(
            newHome.homeowner
              ? `${newHome.homeowner.fullname} - ${newHome.homeowner.citizenId}`
              : ""
          );
          setOwnerName(
            `${newHome.homeowner.fullname} - ${newHome.homeowner.citizenId}`
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

  const fetchDataContract = async () => {
    try {
      const res = await axios.get(`/api/homeContract?homeId=${params.id}`);
      const newContract: ContractInfo[] = res.data;

      // if (newContract.length > 0) {
      setContracts(newContract);
      // } else {
      //   setContracts([]);
      // }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

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
        await notify("success", "Cập nhật thành công");
        window.location.reload();
      } catch (error) {
        console.error("Error saving data:", error);
        notify("error", "Cập nhật thất bại");
        window.location.reload();
      }
    };
    handleSave();
  };

  const handleSubmitContract = () => {
    const handleSave = async () => {
      try {
        const response = await axios.post(`/api/homeContract`, {
          ...contractForm,
          homeId: params.id,
        });
        console.log("Data updated successfully:", response.data);
        notify("success", "Tạo hợp đồng thành công");
        window.location.reload();
      } catch (error: any) {
        console.error("Error saving data:", error);
        setOpen(false);
        if (axios.isAxiosError(error)) {
          // Kiểm tra xem lỗi có phải là lỗi 400 không
          if (
            error.response &&
            error.response.status === 400 &&
            error.response.data.error
          ) {
            const errorMessage = error.response.data.message;
            notify("error", errorMessage);
          }
          notify("error", "Tạo hợp đồng thất bại");
        }
      }
    };

    handleSave();
  };

  const handleCloseDialogDeteleHomeContract = () => {
    setOpenDialogDeteleHomeContract(false);
    setSelectedHomeContract(null);
  };
  const handleDeleteHomeContract = async (id: number) => {
    try {
      const response = await axios.delete(`/api/homeContract/${id}`);
      notify("success", "Delete Successfully");
      window.location.reload();
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      notify("error", errorMessage);
      setOpenDialogDeteleHomeContract(false);
    }
    // window.location.reload(); // Consider updating state instead of reloading the page
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
                {/* {isDisabled === true ? (
                  <TextField
                    // disabled
                    id="owner"
                    label="Tên chủ nhà"
                    type="text"
                    fullWidth
                    value={ownerName}
                    size="small"
                    variant="standard"
                    // InputLabelProps={{
                    //   shrink: true,
                    // }}
                    // InputProps={{
                    //   readOnly: true,
                    // }}
                    onChange={(e) => {
                      setOwnerName(e.target.value);
                    }}
                  />
                ) : ( */}
                <Autocomplete
                  disabled={isDisabled}
                  // hidden={isDisabled}
                  size="small"
                  value={owner}
                  defaultValue={owner as Homeowners}
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
                {/* )} */}
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
                  <TableCell
                    style={{
                      backgroundColor: "#c6c8da",
                    }}
                  >
                    {" "}
                    Hành động
                  </TableCell>
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
                      <TableCell>
                        <Tooltip title="Xem">
                          <IconButton
                            onClick={() => {
                              router.push(
                                `/homes/${row.homeId}/homeContract/${row.homeContractsId}`
                              );
                            }}
                          >
                            <RemoveRedEyeOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            onClick={() => {
                              setOpenDialogDeteleHomeContract(true);
                              setSelectedHomeContract(row.homeContractsId);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <DeleteRecipientDialog
                          openDialogDelete={openDialogDeteleHomeContract}
                          message="Xác nhân xóa thông tin đợt thanh toán đã chọn"
                          handleCloseDialogDelete={
                            handleCloseDialogDeteleHomeContract
                          }
                          selectedRecord={selectedHomeContract}
                          handleDelete={handleDeleteHomeContract}
                        />
                      </TableCell>
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
