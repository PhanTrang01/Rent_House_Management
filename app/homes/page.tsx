"use client";
import Dashboard from "../components/Dashboard";
import Footer from "../components/Footer";
import styled from "@emotion/styled";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Header from "../components/Header";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Guests,
  HomeContract,
  Homeowners,
  Homes,
  StatusContract,
} from "@prisma/client";

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex: 1;
  height: 100hv;
`;

type InfoHome = Homes & {
  homeowner: Homeowners;
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

export default function HomesList() {
  const router = useRouter();
  const [owners, setOwners] = useState<Homeowners[]>([]);
  const [owner, setOwner] = useState<Homeowners | null>(null);
  const [valueTab, setValueTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [typeStatusHome, setTypeStatusHome] = useState(false); // false: đã thuê, true: có thể tạo HD thuê
  const [homes, setHomes] = useState<InfoHome[]>([]);
  const [rentedHomes, setRentedHomes] = useState<InfoHome[]>([]);
  const [inputValue, setInputValue] = useState("");

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

  useEffect(() => {
    axios.get(`/api/homes?status=${typeStatusHome}`).then(function (response) {
      if (typeStatusHome) setHomes(response.data);
      else {
        setRentedHomes(response.data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeStatusHome]);

  useEffect(() => {
    axios.get("/api/owner").then(function (response) {
      setOwners(response.data);
    });
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
    if (valueTab === 1) setTypeStatusHome(true);
    else if (valueTab === 0) setTypeStatusHome(false);
  };

  const handleClose = () => {
    setOpen(false);
    setOwner(null);
    setHomeForm({
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
  };

  const handleSubmit = () => {
    setOpen(false);
    const handleSave = async () => {
      try {
        const response = await axios.post("/api/homes", homeForm);
        console.log("Data saved successfully:", response.data);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };
    handleSave();
    window.location.reload();
  };

  return (
    <Wrapper>
      <Dashboard />
      <WrapperContainer>
        <Header />
        <Typography
          sx={{ margin: "20px" }}
          variant="h5"
          id="tableTitle"
          component="div"
        >
          Quản lý danh sách BĐS
        </Typography>
        <Button
          sx={{ position: "absolute", right: "20px" }}
          variant="outlined"
          onClick={() => {
            setOpen(true);
          }}
        >
          Thêm thông tin căn hộ mới
        </Button>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        >
          <DialogTitle>Thêm thông tin Căn hộ mới</DialogTitle>
          <DialogContent>
            <Autocomplete
              value={owner !== null ? owner : null}
              onChange={(event: any, newValue: Homeowners | null) => {
                if (newValue) {
                  setOwner(newValue);
                  setHomeForm({
                    ...homeForm,
                    homeOwnerId: Number(newValue.homeOwnerId),
                  });
                }
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              id="controllable-states-demo"
              options={owners}
              getOptionKey={(option: { homeOwnerId: number }) =>
                option.homeOwnerId
              }
              getOptionLabel={(option) =>
                `${option.fullname} - ${option.citizenId}` ?? ""
              }
              renderInput={(params) => (
                <TextField {...params} label="Chủ Căn hộ" />
              )}
            />
            <TextField
              required
              autoFocus
              margin="dense"
              id="building"
              label="Tên Tòa nhà"
              type="text"
              fullWidth
              onChange={(e) => {
                setHomeForm({ ...homeForm, building: e.target.value });
              }}
            />
            <TextField
              required
              margin="dense"
              id="apartmentNo"
              label="Căn hộ số"
              type="text"
              fullWidth
              onChange={(e) => {
                setHomeForm({ ...homeForm, apartmentNo: e.target.value });
              }}
            />
            <TextField
              required
              margin="dense"
              id="address"
              label="Địa chỉ"
              type="text"
              fullWidth
              onChange={(e) => {
                setHomeForm({ ...homeForm, address: e.target.value });
              }}
            />
            <TextField
              required
              margin="dense"
              id="Ward"
              label="Phường/Xã"
              type="text"
              fullWidth
              onChange={(e) => {
                setHomeForm({ ...homeForm, Ward: e.target.value });
              }}
            />
            <TextField
              required
              margin="dense"
              id="District"
              label="Quận/huyện"
              type="text"
              fullWidth
              onChange={(e) => {
                setHomeForm({ ...homeForm, District: e.target.value });
              }}
            />
            <TextField
              required
              margin="dense"
              id="Province"
              label="Tỉnh/Thành phố"
              type="text"
              fullWidth
              onChange={(e) => {
                setHomeForm({ ...homeForm, Province: e.target.value });
              }}
            />
            <TextField
              id="Note"
              label="Ghi chú"
              type="number"
              fullWidth
              margin="dense"
              multiline
              maxRows={4}
              onChange={(e) => {
                setHomeForm({ ...homeForm, Note: e.target.value });
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleClose;
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleSubmit}>Lưu</Button>
          </DialogActions>
        </Dialog>
        <Paper sx={{ marginTop: "60px", width: "100%", overflow: "hidden" }}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={valueTab}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Căn hộ đã thuê" value={0} />
                <Tab label="Căn hộ chưa thuê" value={1} />
              </Tabs>
            </Box>
            <CustomTabPanel value={valueTab} index={0}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tòa nhà</TableCell>
                      <TableCell>Căn hộ</TableCell>
                      <TableCell align="right">Tên Chủ nhà</TableCell>
                      <TableCell align="right">Địa chỉ</TableCell>
                      <TableCell align="right">Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rentedHomes.map((row, index) => (
                      <TableRow
                        hover
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        onClick={() => {
                          router.push(`/homes/${row.homeId}`);
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.building}
                        </TableCell>
                        <TableCell align="left">{row.apartmentNo}</TableCell>
                        <TableCell align="right">
                          {row.homeowner?.fullname}
                        </TableCell>
                        <TableCell align="right">
                          {row.address} - {row.Ward} - {row.District}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CustomTabPanel>
            <CustomTabPanel value={valueTab} index={1}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tòa nhà</TableCell>
                      <TableCell align="left">Căn hộ</TableCell>
                      <TableCell align="right">Tên Chủ nhà</TableCell>
                      <TableCell align="right">Địa chỉ</TableCell>
                      <TableCell align="right">Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {homes.map((row, index) => (
                      <TableRow
                        hover
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        onClick={() => {
                          router.push(`/homes/${row.homeId}`);
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.building}
                        </TableCell>
                        <TableCell align="left">{row.apartmentNo}</TableCell>
                        <TableCell align="right">
                          {row.homeowner?.fullname}
                        </TableCell>
                        <TableCell align="right">
                          {row.address} - {row.Ward} - {row.District}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CustomTabPanel>
          </Box>
        </Paper>
      </WrapperContainer>
    </Wrapper>
  );
}
