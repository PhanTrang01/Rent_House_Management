"use client";
import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Guests,
  HomeContract,
  Homeowners,
  Homes,
  StatusContract,
} from "@prisma/client";
import {
  Box,
  Button,
  ButtonProps,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Dashboard from "@/app/components/Dashboard";
import Header from "@/app/components/Header";

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

type HomeContractForm = {
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

interface HomeContractsProps {
  params: {
    id: string;
    idContract: string;
  };
}

export default function HomeContracts({ params }: HomeContractsProps) {
  const [valueTab, setValueTab] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [homeContract, setHomeContract] = useState<ContractInfo>();
  const [homeContractForm, setHomeContractForm] = useState<HomeContractForm>();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/homeContract/${params.idContract}`);
        const newContract: ContractInfo = res.data;
        if (newContract) {
          setHomeContract(newContract);
          const { createdAt, updatedAt, ...newHomeContractForm } = newContract;
          setHomeContractForm(newHomeContractForm);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [params.idContract]);

  const handleEdit = () => {
    setIsDisabled(false);
  };

  const handleCancel = () => {
    setIsDisabled(true);
    window.location.reload();
  };

  const formatDate = (date: Date | null) => {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng từ 0-11, cần cộng thêm 1
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
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
            textAlign: "center",
            padding: " 20px 30px",
            margin: "10px",
          }}
        >
          <Typography variant="h6">Hợp đồng căn hộ </Typography>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={valueTab}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Thông tin chi tiết hợp đồng" value={0} />
                <Tab label="Danh sách hợp đồng dịch vụ" value={1} />
              </Tabs>
            </Box>

            <CustomTabPanel value={valueTab} index={0}>
              <Paper
                elevation={3}
                sx={{
                  textAlign: "center",
                  padding: " 5px",
                  margin: "0px",
                }}
              >
                <Typography variant="h5">
                  Thông tin chi tiết hợp đồng
                </Typography>
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
                        disabled
                        id="apartment"
                        label="Căn hộ"
                        type="text"
                        fullWidth
                        value={`${homeContract?.home.apartmentNo} - ${homeContract?.home.building}`}
                        size="small"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Item>
                  </Grid>
                  <Grid item lg={6}>
                    <Item>
                      <TextField
                        disabled
                        id="address"
                        label="Địa chỉ"
                        type="text"
                        fullWidth
                        value={`${homeContract?.home.address} - ${homeContract?.home.Ward} - ${homeContract?.home.District} - ${homeContract?.home.Province}`}
                        size="small"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Item>
                  </Grid>
                  <Grid item lg={5}>
                    <Item>
                      <TextField
                        disabled
                        id="guest"
                        label="Khách thuê (Tên - Số CCCD)"
                        type="text"
                        fullWidth
                        value={`${homeContract?.guest.fullname} - ${homeContract?.guest.citizenId}`}
                        size="small"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        //   onChange={(e) => {
                        //     setHomeForm({
                        //       ...homeForm,
                        //       apartmentNo: e.target.value,
                        //     });
                        //   }}
                      />
                    </Item>
                  </Grid>
                  <Grid item lg={3}>
                    <Item>
                      <TextField
                        disabled={isDisabled}
                        id="rental"
                        label="Giá thuê (VND/Tháng)"
                        type="number"
                        fullWidth
                        value={homeContractForm?.rental}
                        size="small"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: 0, // Đặt giá trị tối thiểu là 0 nếu cần
                          step: 10000, // Đặt bước nhảy (step)
                        }}
                        onChange={(e) => {
                          // setHomeForm({
                          //   ...homeForm,
                          //   address: e.target.value,
                          // });
                        }}
                      />
                    </Item>
                  </Grid>
                  <Grid item lg={3}>
                    <Item>
                      <TextField
                        disabled={isDisabled}
                        id="deposit"
                        label="Tiền cọc (VND)"
                        type="number"
                        fullWidth
                        value={homeContractForm?.deposit}
                        size="small"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: 0, // Đặt giá trị tối thiểu là 0 nếu cần
                          step: 10000, // Đặt bước nhảy (step)
                        }}
                        onChange={(e) => {
                          // setHomeForm({
                          //   ...homeForm,
                          //   Ward: e.target.value,
                          // });
                        }}
                      />
                    </Item>
                  </Grid>
                  <Grid item lg={2.5}>
                    <Item>
                      <TextField
                        disabled={isDisabled}
                        id="duration"
                        label="Thời hạn thuê (tháng)"
                        type="number"
                        fullWidth
                        value={homeContractForm?.duration}
                        size="small"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: 0, // Đặt giá trị tối thiểu là 0 nếu cần
                          step: 10000, // Đặt bước nhảy (step)
                        }}
                        onChange={(e) => {
                          // setHomeForm({
                          //   ...homeForm,
                          //   Ward: e.target.value,
                          // });
                        }}
                      />
                    </Item>
                  </Grid>
                  <Grid item lg={2.5}>
                    <Item>
                      <TextField
                        disabled={isDisabled}
                        id="payCycle"
                        label="chu kỳ thanh toán"
                        type="number"
                        fullWidth
                        value={homeContractForm?.payCycle}
                        size="small"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: 0, // Đặt giá trị tối thiểu là 0 nếu cần
                          step: 10000, // Đặt bước nhảy (step)
                        }}
                        onChange={(e) => {
                          // setHomeForm({
                          //   ...homeForm,
                          //   Ward: e.target.value,
                          // });
                        }}
                      />
                    </Item>
                  </Grid>
                  <Grid item lg={3}>
                    <Item>
                      <TextField
                        disabled={isDisabled}
                        id="dateStart"
                        label="Ngày bắt đầu"
                        type="date"
                        fullWidth
                        value={
                          homeContractForm
                            ? formatDate(homeContractForm.dateStart)
                            : "10-10-2001"
                        }
                        size="small"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => {
                          // setHomeForm({
                          //   ...homeForm,
                          //   Ward: e.target.value,
                          // });
                        }}
                      />
                    </Item>
                  </Grid>
                  <Grid item lg={3}>
                    <Item>
                      <TextField
                        disabled={isDisabled}
                        id="dateEnd"
                        label="Ngày kết thúc"
                        type="date"
                        fullWidth
                        value={homeContractForm?.dateEnd}
                        size="small"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => {
                          // setHomeForm({
                          //   ...homeForm,
                          //   Ward: e.target.value,
                          // });
                        }}
                      />
                    </Item>
                  </Grid>
                  <Grid item lg={5}>
                    <Item>
                      <TextField
                        disabled={isDisabled}
                        id="Ward"
                        label="Trạng Thái hợp đồng"
                        type="radio"
                        fullWidth
                        value={homeContractForm?.status}
                        size="small"
                        variant="standard"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => {
                          // setHomeForm({
                          //   ...homeForm,
                          //   Ward: e.target.value,
                          // });
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
                      // onClick={handleSubmit}
                    >
                      Lưu
                    </ColorButton>
                  </Grid>
                </Grid>
              </Paper>
            </CustomTabPanel>
            <CustomTabPanel value={valueTab} index={1}></CustomTabPanel>
          </Box>
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
