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
  FilledTextFieldProps,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
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
import { useRouter } from "next/navigation";

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
  const [home, setHome] = useState<Homes>();
  const [contracts, setContracts] = useState<ContractInfo[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);
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
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/homes/${params.id}`);
        const newHome: Homes = res.data;
        if (newHome) {
          setHome(newHome);
          const { createdAt, updatedAt, homeId, ...newHomeForm } = newHome;
          setHomeForm(newHomeForm);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [params.id]);

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

  const handleEdit = () => {
    setIsDisabled(false);
  };

  const handleClose = () => {
    setIsDisabled(true);
    window.location.reload();
  };

  const handleSubmit = () => {
    // const handleSave = async () => {
    //   try {
    //     const response = await axios.put(`/api/guest/${params.id}`, guestForm);
    //     console.log("Data updated successfully:", response.data);
    //   } catch (error) {
    //     console.error("Error saving data:", error);
    //   }
    // };
    // handleSave();
    // route.push("/guest");
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
          <Typography variant="h5">Thông tin Căn hộ</Typography>
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
                  value={homeForm.Note}
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
            <Grid lg={6}>
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
            <Grid lg={4}>
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
          <Typography variant="h6">Danh sách hợp đồng căn hộ</Typography>
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
                        router.push(`/homes/${row.homeId}/homeContract`);
                      }}
                    >
                      <TableCell align="left">
                        {row.home.homeowner.fullname}
                      </TableCell>
                      <TableCell align="left">{row.guest.fullname}</TableCell>
                      <TableCell align="left">{row.duration} tháng</TableCell>
                      <TableCell align="center">
                        {row.deposit.toLocaleString("en-EN")}{" "}
                      </TableCell>
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
