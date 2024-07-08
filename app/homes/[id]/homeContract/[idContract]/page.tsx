"use client";
import styled from "@emotion/styled";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Guests,
  HomeContract,
  Homeowners,
  Homes,
  InvoicesPayment,
  Receiver,
  Service,
  ServiceContract,
  StatusContract,
  TypeInvoice,
} from "@prisma/client";
import {
  Autocomplete,
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import Dashboard from "@/app/components/Dashboard";
import Header from "@/app/components/Header";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
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

type ContractInfo = HomeContract & {
  home: Homes & {
    homeowner: Homeowners;
  };
  guest: Guests;
};

type ContractSInfo = ServiceContract & {
  home: Homes;
  service: Service;
};

type HomeContractForm = {
  homeId: number | null;
  guestId: number | null;
  duration: number;
  payCycle: number;
  rental: number;
  deposit: number;
  dateStart: Date;
  dateEnd: Date;
  status: StatusContract;
};
type ServiceContractForm = {
  homeContractId: number | null;
  homeId: number | null;
  guestId: number | null;
  serviceId: number | null;
  duration: number;
  payCycle: number;
  unitCost: number;
  limit: number;
  dateStart: Date;
  dateEnd: Date;
  status: StatusContract;
};

type InvoiceForm = {
  serviceContractId: number | null;
  homeContractId: number | null;
  homeId: number | null;
  dateStart: Date;
  type: TypeInvoice;
  receiverId: number;
  duration: number;
  cycle: number;
  rental: number;
  limit: number;
  totalSend: number;
};

type InvoiceUpdateForm = {
  invoiceId: number | null;
  statusPayment: boolean;
  totalSend: number | null;
  totalReceiver: number | null;
  dateRemind: Date | null;
};

type Invoice = InvoicesPayment & {
  receiver: Receiver;
  homeContract: HomeContract;
  serviceContract: ServiceContract;
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
        <Box sx={{ p: 1 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

interface Column {
  id:
    | "index"
    | "dateStart"
    | "dateEnd"
    | "datePaymentRemind"
    | "datePaymentExpect"
    | "totalReceiver"
    | "datePaymentReal"
    | "totalSend"
    | "receiver"
    | "statusPayment";
  label: string;
  minWidth?: number;
  align?: "right" | "center";
  format?: (value: String) => String;
}

const columns: readonly Column[] = [
  { id: "index", label: "Đợt", minWidth: 50 },
  { id: "dateStart", label: "Ngày bắt đầu", minWidth: 100 },
  { id: "dateEnd", label: "Ngày kết thúc", minWidth: 100 },
  {
    id: "datePaymentRemind",
    label: "Ngày nhắc hẹn",
    minWidth: 130,
    align: "right",
  },
  {
    id: "datePaymentExpect",
    label: "Hạn thanh toán",
    minWidth: 130,
    align: "right",
  },
  {
    id: "totalReceiver",
    label: "Số tiền thu",
    minWidth: 80,
    align: "center",
  },
  {
    id: "datePaymentReal",
    label: "Ngày nộp tiền cho chủ nhà/dvu",
    minWidth: 110,
    align: "center",
  },
  {
    id: "totalSend",
    label: "Số tiền nộp (cho chủ nhà/dvu)",
    minWidth: 80,
    align: "center",
  },
  {
    id: "receiver",
    label: "Người nhận",
    minWidth: 220,
    align: "center",
  },
  {
    id: "statusPayment",
    label: "Trạng thái thanh toán",
    minWidth: 80,
    align: "center",
  },
];

//Table data Service Contract
interface ColumnService {
  id:
    | "service"
    | "unitCost"
    | "duration"
    | "payCycle"
    | "dateStart"
    | "dateEnd"
    | "statusContract";
  label: string;
  minWidth?: number;
  align?: "right" | "center";
  format?: (value: String) => String;
}

const columnService: readonly ColumnService[] = [
  { id: "service", label: "Tên dịch vụ", minWidth: 50 },
  { id: "unitCost", label: "Đơn giá", minWidth: 100 },
  { id: "duration", label: "Thời hạn (Tháng)", minWidth: 100 },
  {
    id: "payCycle",
    label: "Chu kỳ thanh toán (Tháng)",
    minWidth: 130,
    align: "right",
  },
  {
    id: "dateStart",
    label: "Ngày bắt đầu",
    minWidth: 130,
    align: "right",
  },
  {
    id: "dateEnd",
    label: "Ngày kết thúc",
    minWidth: 80,
    align: "center",
  },
  {
    id: "statusContract",
    label: "Trạng thái hợp đồng",
    minWidth: 170,
    align: "right",
  },
];
interface HomeContractsProps {
  params: {
    id: string;
    idContract: string;
  };
}

export default function HomeContracts({ params }: HomeContractsProps) {
  const route = useRouter();
  const { notify } = useContext(ToastContext);

  const [valueTab, setValueTab] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [homeContract, setHomeContract] = useState<ContractInfo>();
  const [homeContractForm, setHomeContractForm] = useState<HomeContractForm>({
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

  const [openDialog, setOpenDialog] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [receiver, setReceiver] = useState<Receiver | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isCreatedInvoice, setIsCreatedInvoice] = useState(true);
  const [dataCreateInvoices, setDataCreateInvoice] = useState<InvoiceForm>({
    serviceContractId: null,
    homeContractId: null,
    homeId: null,
    dateStart: new Date(),
    type: TypeInvoice.HOME,
    receiverId: 0,
    duration: 0,
    cycle: 0,
    rental: 0,
    limit: 0,
    totalSend: 0,
  });

  const [openDialogService, setOpenDialogService] = useState(false);
  const [openDialogServiceInvoice, setOpenDialogServiceInvoice] =
    useState(false);
  const [inputValueService, setInputValueService] = useState("");
  const [service, setService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceContract, setServiceContract] = useState<ContractSInfo | null>(
    null
  );
  const [serviceContracts, setServiceContracts] = useState<ContractSInfo[]>([]);
  const [sInvoices, setSInvoices] = useState<Invoice[]>([]);
  const [serviceContractForm, setServiceContractForm] =
    useState<ServiceContractForm>({
      homeContractId: null,
      homeId: null,
      guestId: null,
      serviceId: null,
      duration: 6,
      payCycle: 1,
      unitCost: 0,
      limit: 0,
      dateStart: new Date(),
      dateEnd: new Date(),
      status: StatusContract.ACTIVE,
    });

  const [selectedSContract, setSelectedSContract] = useState<number | null>(
    null
  );
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [statusPayment, setStatusPayment] = useState(false);
  const [dataUpdateInvoice, setDataUpdateInvoice] = useState<InvoiceUpdateForm>(
    {
      invoiceId: 0,
      statusPayment: false,
      totalSend: 0,
      totalReceiver: 0,
      dateRemind: null,
    }
  );
  const [openDialogUpdateStatusPayment, setOpenDialogUpdateStatusPayment] =
    useState(false);
  const [openDialogUpdateServiceInvoice, setOpenDialogUpdateServiceInvoice] =
    useState(false);
  const [openDialogDeteleInvoice, setOpenDialogDeteleInvoice] = useState(false);
  const [openDialogDeteleSContract, setOpenDialogDeteleSContract] =
    useState(false);

  const handleBack = () => {
    route.push(`/homes/${params.id}`);
  };
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
          setServiceContractForm({
            ...serviceContractForm,
            homeId: Number(params.id),
            homeContractId: Number(params.idContract),
            guestId: newContract.guestId,
            dateStart: newContract.dateStart,
            dateEnd: newContract.dateEnd,
          });
        }
      } catch (error) {
        console.error("Contract fail: ", error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.idContract]);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(
          `/api/invoice?homeContractId=${params.idContract}&type=HOME`
        );
        setInvoices(response.data);
        if (invoices.length === 0) setIsCreatedInvoice(false);
        else setIsCreatedInvoice(true);
        // console.log("Data read Invoice successfully:", response.data);
        const res = await axios.get(
          `/api/servicerContract?homeContractId=${params.idContract}`
        );
        setServiceContracts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSInvoice = async (id: Number) => {
    try {
      const response = await axios.get(`/api/invoice?serviceContractId=${id}`);
      setSInvoices(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchReceivers = async () => {
      try {
        const res = await axios.get("/api/receiver");
        setReceivers(res.data);
        const resS = await axios.get("/api/serviceO");
        setServices(resS.data);
      } catch (error) {
        console.error("Receiver fail :", error);
      }
    };
    fetchReceivers();
  }, []);

  const handleOpenDialog = async () => {
    setDataCreateInvoice({
      ...dataCreateInvoices,
      homeId: Number(params.id),
      homeContractId: Number(params.idContract),
      duration: homeContractForm.duration,
      cycle: homeContractForm.payCycle,
      rental: homeContractForm.rental,
      dateStart: homeContractForm.dateStart,
      type: TypeInvoice.HOME,
    });
    setOpenDialog(true);
  };
  //-------------------------------------------------Lỗi This-------------------------------------------------

  const handleOpenDialogServiceInvoice = async (SContract: ContractSInfo) => {
    // const res = await axios.get(`/api/servicerContract/${idContractS}`);
    setServiceContract(SContract);
    console.log(serviceContract);
    // if (serviceContract) {
    setDataCreateInvoice({
      ...dataCreateInvoices,
      serviceContractId: Number(SContract.serviceContractId),
      homeId: Number(params.id),
      homeContractId: Number(params.idContract),
      duration: Number(SContract.duration),
      cycle: SContract.payCycle,
      limit: SContract.limit ? SContract.limit : 0,
      dateStart: SContract.dateStart,
      type: TypeInvoice.SERVICE,
    });
    // }
    setOpenDialogServiceInvoice(true);
    console.log(dataCreateInvoices);
  };

  const handleCreateInvoice = () => {
    const create = async () => {
      try {
        const response = await axios.post("/api/invoice", dataCreateInvoices);
        console.log("Data saved successfully:", response.data);
        notify("success", "Tạo các đợt thanh toán thành công");
        window.location.reload();
      } catch (error: any) {
        console.error("Error: ", error);
        notify("error", error.response.data.error);
        setOpenDialog(false);
      }
    };
    create();
    // window.location.reload();
  };

  const handleEdit = () => {
    setIsDisabled(false);
  };

  const handleCancel = () => {
    setIsDisabled(true);
    window.location.reload();
  };

  const handleSubmitEdit = () => {
    const handleSave = async () => {
      try {
        const response = await axios.put(
          `/api/homeContract/${params.idContract}`,
          homeContractForm
        );
        console.log("Data updated successfully:", response.data);
        notify("success", "Cập nhật hợp đồng căn hộ thành công");
      } catch (error) {
        console.error("Error saving data:", error);
        notify("error", "Cập nhật hợp đồng căn hộ thất bại");
      }
    };
    handleSave();
    window.location.reload();
  };

  const handleCreateServiceContract = () => {
    const create = async () => {
      try {
        const response = await axios.post(
          "/api/servicerContract",
          serviceContractForm
        );
        console.log("Data saved successfully:", response.data);
        notify("success", "Create successfully");
        window.location.reload();
      } catch (error) {
        console.error("Error: ", error);
        notify("error", "Tạo hợp đồng dịch vụ thất bại");
        setOpenDialogService(false);
      }
    };
    create();
  };

  const handleUpdateStatus = () => {
    const update = async () => {
      try {
        const response = await axios.put(
          `/api/invoice/${selectedInvoice}`,
          dataUpdateInvoice
        );
        console.log("Data updated successfully:", response.data);
        notify("success", "Update successfully");
        window.location.reload();
      } catch (error) {
        console.error("Error saving data:", error);
        notify("error", "Cập nhật thất bại");
      }
    };
    update();
  };

  const handleUpdateStatusServiceContract = () => {
    const update = async () => {
      try {
        const status = serviceContract?.statusContract;
        const response = await axios.put(
          `/api/servicerContract/${serviceContract?.serviceContractId}`,
          {
            status,
          }
        );
        console.log("Data updated successfully:", response.data);
        notify("success", "Update successfully");
        window.location.reload();
      } catch (error) {
        console.error("Error saving data:", error);
        setOpenDialogUpdateStatusPayment(false);
        notify("error", "Cập nhật thất bại");
      }
    };
    update();
  };

  const handleCloseDialogDateleSContract = () => {
    setOpenDialogDeteleSContract(false);
    setServiceContract(null);
  };
  const handleDeleteSContract = async (id: number) => {
    try {
      const response = await axios.delete(`/api/servicerContract/${id}`);
      notify("success", "Delete Successfully");
      window.location.reload();
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      notify("error", errorMessage);
      setOpenDialogDeteleInvoice(false);
    }
    // window.location.reload(); // Consider updating state instead of reloading the page
  };

  const handleCloseDialogDateleInvoice = () => {
    setOpenDialogDeteleInvoice(false);
    setSelectedInvoice(null);
  };
  const handleDeleteInvoice = async (id: number) => {
    try {
      const response = await axios.delete(`/api/invoice/${id}`);
      notify("success", "Delete Successfully");
      window.location.reload();
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      notify("error", errorMessage);
      setOpenDialogDeteleInvoice(false);
    }
    // window.location.reload(); // Consider updating state instead of reloading the page
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
            padding: " 20px",
            // margin: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              textAlign: "center",
              width: "100%",
            }}
          >
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ flex: "1" }}>
              Hợp đồng căn hộ{" "}
            </Typography>
          </div>
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
                }}
              >
                <Typography variant="h6">
                  Thông tin chi tiết hợp đồng
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker", "DatePicker"]}>
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
                              setHomeContractForm({
                                ...homeContractForm,
                                rental: Number(e.target.value),
                              });
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
                              setHomeContractForm({
                                ...homeContractForm,
                                deposit: Number(e.target.value),
                              });
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
                              step: 1, // Đặt bước nhảy (step)
                            }}
                            onChange={(e) => {
                              setHomeContractForm({
                                ...homeContractForm,
                                duration: Number(e.target.value),
                              });
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
                              step: 1, // Đặt bước nhảy (step)
                            }}
                            onChange={(e) => {
                              setHomeContractForm({
                                ...homeContractForm,
                                payCycle: Number(e.target.value),
                              });
                            }}
                          />
                        </Item>
                      </Grid>
                      <Grid item lg={3}>
                        <Item>
                          <DatePicker
                            disabled={isDisabled}
                            label="Ngày bắt đầu"
                            value={dayjs(homeContractForm?.dateStart)}
                            onChange={(newValue) => {
                              if (newValue) {
                                const temp = newValue?.toDate();
                                setHomeContractForm({
                                  ...homeContractForm,
                                  dateStart: temp,
                                });
                              }
                            }}
                          />
                        </Item>
                      </Grid>
                      <Grid item lg={3}>
                        <Item>
                          <DatePicker
                            disabled={isDisabled}
                            label="Ngày kết thúc"
                            value={dayjs(homeContractForm?.dateEnd)}
                            onChange={(newValue) => {
                              if (newValue) {
                                const temp = newValue?.toDate();
                                setHomeContractForm({
                                  ...homeContractForm,
                                  dateEnd: temp,
                                });
                              }
                            }}
                          />
                        </Item>
                      </Grid>
                      <Grid item lg={5}>
                        <Item>
                          <FormControl
                            fullWidth
                            disabled={isDisabled}
                            size="small"
                            variant="standard"
                          >
                            <InputLabel id="status-label">
                              Trạng thái hợp đồng
                            </InputLabel>
                            <Select
                              labelId="status-label"
                              id="status"
                              value={homeContractForm.status}
                              label="Trạng thái hợp đồng"
                              onChange={(event: SelectChangeEvent) => {
                                setHomeContractForm({
                                  ...homeContractForm,
                                  status: event.target.value as StatusContract,
                                });
                              }}
                            >
                              <MenuItem value={StatusContract.ACTIVE}>
                                ACTIVE
                              </MenuItem>
                              <MenuItem value={StatusContract.DRAFT}>
                                DRAFT
                              </MenuItem>
                              <MenuItem value={StatusContract.FINISH}>
                                FINISH
                              </MenuItem>
                            </Select>
                          </FormControl>
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
                      size="medium"
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
                      size="medium"
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
                      size="medium"
                      onClick={handleSubmitEdit}
                    >
                      Lưu thay đổi
                    </ColorButton>
                  </Grid>
                </Grid>
              </Paper>
              <Paper>
                <div
                  style={{
                    display: "flex",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" sx={{ flex: "1" }}>
                    Thông tin chi tiết các đợt thanh toán
                  </Typography>
                  <Button
                    hidden={isCreatedInvoice}
                    sx={{ textAlign: "right", margin: "5px" }}
                    variant="outlined"
                    size="small"
                    endIcon={<PostAddIcon />}
                    onClick={handleOpenDialog}
                  >
                    Tạo các đợt thanh toán
                  </Button>
                </div>
                <Dialog open={openDialog} maxWidth="md" fullWidth>
                  <DialogTitle>Tạo thông tin các đợt thanh toán</DialogTitle>
                  <DialogContent>
                    <Autocomplete
                      value={receiver !== null ? receiver : null}
                      onChange={(event: any, newValue: Receiver | null) => {
                        if (newValue) {
                          setReceiver(newValue);
                          setDataCreateInvoice({
                            ...dataCreateInvoices,
                            receiverId: Number(newValue.receiverId),
                          });
                        }
                      }}
                      inputValue={inputValue}
                      onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                      }}
                      id="controllable-states-demo"
                      options={receivers}
                      getOptionKey={(option: { receiverId: number }) =>
                        option.receiverId
                      }
                      getOptionLabel={(option) =>
                        `${option.name} - ${option.TenTK} - ${option.STK} - ${option.Nganhang}` ??
                        ""
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Người nhận" />
                      )}
                    />
                    <TextField
                      autoFocus
                      margin="dense"
                      id="totalSend"
                      label="Số tiền nộp cho chủ nhà"
                      type="number"
                      value={dataCreateInvoices.totalSend}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: 0, // Đặt giá trị tối thiểu là 0 nếu cần
                        step: 10000, // Đặt bước nhảy (step)
                      }}
                      onChange={(e) => {
                        setDataCreateInvoice({
                          ...dataCreateInvoices,
                          totalSend: Number(e.target.value),
                        });
                      }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setOpenDialog(false);
                        setReceiver(null);
                      }}
                    >
                      Hủy
                    </Button>
                    <Button onClick={handleCreateInvoice}>Lưu</Button>
                  </DialogActions>
                </Dialog>
                <TableContainer sx={{ width: "100%", maxHeight: 340 }}>
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
                            minWidth: "130",
                            backgroundColor: "#c6c8da",
                          }}
                        >
                          {" "}
                          Hành Động
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoices.map((row, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.invoiceId}
                          >
                            <TableCell align="center">
                              {`Đợt ${index + 1}`}
                            </TableCell>
                            <TableCell align="center">
                              {dayjs
                                .utc(row.dateStart.toString())
                                .format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell align="center">
                              {dayjs
                                .utc(row.dateEnd.toString())
                                .format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell align="center">
                              {dayjs
                                .utc(row.datePaymentRemind.toString())
                                .format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell align="center">
                              {dayjs
                                .utc(row.datePaymentExpect.toString())
                                .format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell align="center">
                              {row.totalReceiver.toLocaleString("en-EN")}
                            </TableCell>
                            <TableCell align="center">
                              {dayjs
                                .utc(row.datePaymentReal.toString())
                                .format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell align="center">
                              {row.totalSend.toLocaleString("en-EN")}
                            </TableCell>
                            <TableCell align="center">
                              {row.receiver?.TenTK?.toString()} -{" "}
                              {row.receiver?.STK?.toString()}-
                              {row.receiver?.Nganhang?.toString()}
                            </TableCell>
                            <TableCell align="center">
                              {row.statusPayment === true ? (
                                <CheckCircleOutlineIcon color="success" />
                              ) : (
                                <RemoveCircleOutlineIcon color="disabled" />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Chỉnh sửa">
                                <IconButton
                                  onClick={() => {
                                    setSelectedInvoice(row.invoiceId);
                                    setDataUpdateInvoice({
                                      invoiceId: row.invoiceId,
                                      statusPayment: row.statusPayment,
                                      totalSend: row.totalSend,
                                      totalReceiver: row.totalReceiver,
                                      dateRemind: row.datePaymentRemind,
                                    });
                                    setOpenDialogUpdateStatusPayment(true);
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa">
                                <IconButton
                                  onClick={() => {
                                    setOpenDialogDeteleInvoice(true);
                                    setSelectedInvoice(row.invoiceId);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              <DeleteRecipientDialog
                                openDialogDelete={openDialogDeteleInvoice}
                                message="Xác nhân xóa thông tin đợt thanh toán đã chọn"
                                handleCloseDialogDelete={
                                  handleCloseDialogDateleInvoice
                                }
                                selectedRecord={selectedInvoice}
                                handleDelete={handleDeleteInvoice}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Dialog open={openDialogUpdateStatusPayment}>
                  <DialogTitle>Cập nhật trạng thái thanh toán</DialogTitle>
                  <DialogContent>
                    <FormControl size="small" variant="standard" fullWidth>
                      <InputLabel id="status-label">
                        Trạng thái Thanh toán
                      </InputLabel>
                      <Select
                        labelId="statusPayment"
                        id="status"
                        value={dataUpdateInvoice.statusPayment.toString()}
                        label="Trạng thái Thanh toán"
                        onChange={(event: SelectChangeEvent) => {
                          setDataUpdateInvoice({
                            ...dataUpdateInvoice,
                            statusPayment: Boolean(event.target.value),
                          });
                        }}
                      >
                        <MenuItem value="true">Đã thanh toán</MenuItem>
                        <MenuItem value="false">Chưa thanh toán</MenuItem>
                      </Select>
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setOpenDialogUpdateStatusPayment(false);
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={() => {
                        handleUpdateStatus();
                      }}
                    >
                      Lưu
                    </Button>
                  </DialogActions>
                </Dialog>
              </Paper>
            </CustomTabPanel>
            <CustomTabPanel value={valueTab} index={1}>
              <Button
                sx={{
                  alignContent: "right",
                  margin: " 0 0 0px 1200px",
                }}
                variant="outlined"
                size="small"
                onClick={() => {
                  setOpenDialogService(true);
                }}
              >
                Tạo hợp đồng dịch vụ
              </Button>
              <Dialog open={openDialogService} maxWidth="md" fullWidth>
                <DialogTitle>Tạo hợp đồng dịch vụ mới</DialogTitle>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker", "DatePicker"]}>
                    <DialogContent>
                      <Autocomplete
                        value={service !== null ? service : null}
                        onChange={(event: any, newValue: Service | null) => {
                          if (newValue) {
                            setService(newValue);
                            setServiceContractForm({
                              ...serviceContractForm,
                              serviceId: Number(newValue.serviceId),
                            });
                          }
                        }}
                        inputValue={inputValueService}
                        onInputChange={(event, newInputValue) => {
                          setInputValueService(newInputValue);
                        }}
                        id="controllable-states-demo"
                        options={services}
                        getOptionKey={(option: { serviceId: number }) =>
                          option.serviceId
                        }
                        getOptionLabel={(option) =>
                          `${option.name}  ${option.description}` ?? ""
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Dịch vụ" />
                        )}
                      />
                      <TextField
                        required
                        margin="dense"
                        id="duration"
                        label="Thời hạn (Tháng)"
                        type="number"
                        fullWidth
                        onChange={(e) => {
                          setServiceContractForm({
                            ...serviceContractForm,
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
                          setServiceContractForm({
                            ...serviceContractForm,
                            payCycle: Number(e.target.value),
                          });
                        }}
                      />
                      <TextField
                        required
                        margin="dense"
                        id="limit"
                        label="Khoản thu mặc định (nếu có)"
                        type="number"
                        fullWidth
                        inputProps={{
                          min: 0, // Đặt giá trị tối thiểu là 0 nếu cần
                          step: 10000, // Đặt bước nhảy (step)
                        }}
                        onChange={(e) => {
                          setServiceContractForm({
                            ...serviceContractForm,
                            limit: Number(e.target.value),
                          });
                        }}
                      />
                      <DatePicker
                        sx={{ width: "50%", padding: "7px 0" }}
                        label="Ngày bắt đầu"
                        value={dayjs.utc(serviceContractForm?.dateStart)}
                        onChange={(newValue) => {
                          if (newValue) {
                            const temp = newValue?.toDate();
                            setServiceContractForm({
                              ...serviceContractForm,
                              dateStart: temp,
                            });
                          }
                        }}
                      />
                      <DatePicker
                        sx={{ width: "50%", padding: "7px 0" }}
                        label="Ngày kết thúc"
                        value={dayjs.utc(serviceContractForm?.dateEnd)}
                        onChange={(newValue) => {
                          if (newValue) {
                            const temp = newValue?.toDate();
                            setServiceContractForm({
                              ...serviceContractForm,
                              dateEnd: temp,
                            });
                          }
                        }}
                      />
                    </DialogContent>
                  </DemoContainer>
                </LocalizationProvider>
                <DialogActions>
                  <Button
                    onClick={() => {
                      setOpenDialogService(false);
                    }}
                  >
                    Hủy
                  </Button>
                  <Button onClick={handleCreateServiceContract}>Lưu</Button>
                </DialogActions>
              </Dialog>
              <TableContainer
                sx={{
                  width: "100%",
                  maxHeight: 550,
                  padding: "7px",
                }}
              >
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columnService.map((column) => (
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
                    {serviceContracts
                      //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.serviceContractId}
                            // onClick={() =>
                            //   router.push(`/guest/${row.guestId}`);
                            // }}
                          >
                            <TableCell align="center">
                              {row.service?.name}
                            </TableCell>
                            <TableCell align="center">{row.unitCost}</TableCell>
                            <TableCell align="center">{row.duration}</TableCell>
                            <TableCell align="center">{row.payCycle}</TableCell>
                            <TableCell align="center">
                              {dayjs
                                .utc(row.dateStart.toString())
                                .format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell align="center">
                              {dayjs
                                .utc(row.dateEnd.toString())
                                .format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell align="center">
                              {row.statusContract.toString()}
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Tạo các đợt thanh toán">
                                <IconButton
                                  onClick={() => {
                                    handleOpenDialogServiceInvoice(row);
                                    console.log(row);
                                  }}
                                >
                                  <AddCircleOutlineIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xem các đợt thanh toán">
                                <IconButton
                                  onClick={() =>
                                    fetchSInvoice(row.serviceContractId)
                                  }
                                >
                                  <FeedOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cập nhật">
                                <IconButton
                                  onClick={() => {
                                    setServiceContract(row);
                                    setOpenDialogUpdateServiceInvoice(true);
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa">
                                <IconButton
                                  onClick={() => {
                                    setServiceContract(row);
                                    setOpenDialogDeteleSContract(true);
                                    setSelectedSContract(row.serviceContractId);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              <DeleteRecipientDialog
                                openDialogDelete={openDialogDeteleSContract}
                                message="Xác nhận xóa hợp đồng dịch vụ đã chọn"
                                handleCloseDialogDelete={
                                  handleCloseDialogDateleSContract
                                }
                                selectedRecord={selectedSContract}
                                handleDelete={handleDeleteSContract}
                              />
                              <Dialog
                                open={openDialogServiceInvoice}
                                maxWidth="md"
                                fullWidth
                              >
                                <DialogTitle>
                                  Tạo thông tin các đợt thanh toán
                                </DialogTitle>
                                <DialogContent>
                                  <Autocomplete
                                    value={receiver !== null ? receiver : null}
                                    onChange={(
                                      event: any,
                                      newValue: Receiver | null
                                    ) => {
                                      if (newValue) {
                                        setReceiver(newValue);
                                        setDataCreateInvoice({
                                          ...dataCreateInvoices,
                                          receiverId: Number(
                                            newValue.receiverId
                                          ),
                                        });
                                      }
                                    }}
                                    inputValue={inputValue}
                                    onInputChange={(event, newInputValue) => {
                                      setInputValue(newInputValue);
                                    }}
                                    id="controllable-states-demo"
                                    options={receivers}
                                    getOptionKey={(option: {
                                      receiverId: number;
                                    }) => option.receiverId}
                                    getOptionLabel={(option) =>
                                      `${option.name} - ${option.TenTK} - ${option.STK} - ${option.Nganhang}` ??
                                      ""
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Người nhận"
                                      />
                                    )}
                                  />
                                  <TextField
                                    autoFocus
                                    margin="dense"
                                    id="totalSend"
                                    label="Số tiền nộp cho chủ dịch vụ"
                                    type="number"
                                    value={dataCreateInvoices.totalSend}
                                    fullWidth
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    inputProps={{
                                      min: 0, // Đặt giá trị tối thiểu là 0 nếu cần
                                      step: 100000, // Đặt bước nhảy (step)
                                    }}
                                    onChange={(e) => {
                                      setDataCreateInvoice({
                                        ...dataCreateInvoices,
                                        totalSend: Number(e.target.value),
                                      });
                                    }}
                                  />
                                  <TextField
                                    autoFocus
                                    margin="dense"
                                    id="totalSend"
                                    label="Số tiền thu từ khách (VND/Tháng)"
                                    type="number"
                                    value={dataCreateInvoices.limit}
                                    fullWidth
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    inputProps={{
                                      min: 0, // Đặt giá trị tối thiểu là 0 nếu cần
                                      step: 100000, // Đặt bước nhảy (step)
                                    }}
                                    onChange={(e) => {
                                      setDataCreateInvoice({
                                        ...dataCreateInvoices,
                                        limit: Number(e.target.value),
                                      });
                                    }}
                                  />
                                </DialogContent>
                                <DialogActions>
                                  <Button
                                    onClick={() => {
                                      setOpenDialogServiceInvoice(false);
                                      setReceiver(null);
                                    }}
                                  >
                                    Hủy
                                  </Button>
                                  <Button onClick={handleCreateInvoice}>
                                    Lưu
                                  </Button>
                                </DialogActions>
                              </Dialog>
                              <Dialog open={openDialogUpdateServiceInvoice}>
                                <DialogTitle>
                                  Cập nhật trạng hợp đồng
                                </DialogTitle>
                                <DialogContent>
                                  <FormControl
                                    size="small"
                                    variant="standard"
                                    fullWidth
                                  >
                                    <InputLabel id="status-label">
                                      Trạng thái Hợp đồng
                                    </InputLabel>
                                    <Select
                                      labelId="statusPayment"
                                      id="status"
                                      value={
                                        serviceContract
                                          ? serviceContract.statusContract
                                          : StatusContract.DRAFT
                                      }
                                      label="Trạng thái Thanh toán"
                                      onChange={(event: SelectChangeEvent) => {
                                        if (serviceContract)
                                          setServiceContract({
                                            ...serviceContract,
                                            statusContract:
                                              StatusContract[
                                                event.target
                                                  .value as keyof typeof StatusContract
                                              ],
                                          });
                                      }}
                                    >
                                      <MenuItem value={StatusContract.ACTIVE}>
                                        ACTIVE
                                      </MenuItem>
                                      <MenuItem value={StatusContract.FINISH}>
                                        FINISH
                                      </MenuItem>
                                      <MenuItem value={StatusContract.DRAFT}>
                                        DRAFT
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </DialogContent>
                                <DialogActions>
                                  <Button
                                    onClick={() => {
                                      setOpenDialogUpdateServiceInvoice(false);
                                    }}
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleUpdateStatusServiceContract();
                                    }}
                                  >
                                    Lưu
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              {sInvoices.length === 0 ? (
                ""
              ) : (
                <Paper>
                  <Typography>Danh sách đợt thanh toán</Typography>
                  <TableContainer sx={{ width: "100%", maxHeight: 340 }}>
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
                        {sInvoices.map((row, index) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.invoiceId}
                              onClick={() => {}}
                            >
                              <TableCell align="center">
                                {`Đợt ${index + 1}`}
                              </TableCell>
                              <TableCell align="center">
                                {dayjs
                                  .utc(row.dateStart.toString())
                                  .format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell align="center">
                                {dayjs
                                  .utc(row.dateEnd.toString())
                                  .format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell align="center">
                                {dayjs
                                  .utc(row.datePaymentRemind.toString())
                                  .format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell align="center">
                                {dayjs
                                  .utc(row.datePaymentExpect.toString())
                                  .format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell align="center">
                                {row.totalReceiver.toLocaleString("en-EN")}
                              </TableCell>
                              <TableCell align="center">
                                {dayjs
                                  .utc(row.datePaymentReal.toString())
                                  .format("DD/MM/YYYY")}
                              </TableCell>
                              <TableCell align="center">
                                {row.totalSend.toLocaleString("en-EN")}
                              </TableCell>
                              <TableCell align="center">
                                {row.receiver?.TenTK?.toString()} -{" "}
                                {row.receiver?.STK?.toString()}-
                                {row.receiver?.Nganhang?.toString()}
                              </TableCell>
                              <TableCell align="center">
                                {row.statusPayment === true ? (
                                  <CheckCircleOutlineIcon color="success" />
                                ) : (
                                  <RemoveCircleOutlineIcon color="disabled" />
                                )}
                              </TableCell>

                              {/* })} */}
                              <TableCell align="center">
                                <Tooltip title="Chỉnh sửa">
                                  <IconButton
                                    onClick={() => {
                                      setSelectedInvoice(row.invoiceId);
                                      setDataUpdateInvoice({
                                        invoiceId: row.invoiceId,
                                        statusPayment: row.statusPayment,
                                        totalSend: row.totalSend,
                                        totalReceiver: row.totalReceiver,
                                        dateRemind: row.datePaymentRemind,
                                      });
                                      setOpenDialogUpdateStatusPayment(true);
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa">
                                  <IconButton
                                    onClick={() => {
                                      setOpenDialogDeteleInvoice(true);
                                      setSelectedInvoice(row.invoiceId);
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                                <DeleteRecipientDialog
                                  openDialogDelete={openDialogDeteleInvoice}
                                  message="Xác nhân xóa thông tin đợt thanh toán đã chọn"
                                  handleCloseDialogDelete={
                                    handleCloseDialogDateleInvoice
                                  }
                                  selectedRecord={selectedInvoice}
                                  handleDelete={handleDeleteInvoice}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Dialog open={openDialogUpdateStatusPayment}>
                    <DialogTitle>Cập nhật thông tin đợt thanh toán</DialogTitle>
                    <DialogContent>
                      <FormControl size="small" variant="standard" fullWidth>
                        <InputLabel id="status-label">
                          Trạng thái Thanh toán
                        </InputLabel>
                        <Select
                          labelId="statusPayment"
                          id="status"
                          value={dataUpdateInvoice.statusPayment.toString()}
                          label="Trạng thái Thanh toán"
                          onChange={(event: SelectChangeEvent) => {
                            setDataUpdateInvoice({
                              ...dataUpdateInvoice,
                              statusPayment: Boolean(event.target.value),
                            });
                          }}
                        >
                          <MenuItem value="true">Đã thanh toán</MenuItem>
                          <MenuItem value="false">Chưa thanh toán</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        autoFocus
                        margin="dense"
                        variant="standard"
                        id="totalSend"
                        label="Số tiền nộp cho chủ dịch vụ"
                        type="number"
                        value={dataUpdateInvoice.totalSend}
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: 0, // Đặt giá trị tối thiểu là 0 nếu cần
                          step: 100000, // Đặt bước nhảy (step)
                        }}
                        onChange={(e) => {
                          setDataUpdateInvoice({
                            ...dataUpdateInvoice,
                            totalSend: Number(e.target.value),
                          });
                        }}
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        variant="standard"
                        id="totalReceiver"
                        label="Số tiền thu từ khách (VND/Tháng)"
                        type="number"
                        value={dataUpdateInvoice.totalReceiver}
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: 0, // Đặt giá trị tối thiểu là 0 nếu cần
                          step: 100000, // Đặt bước nhảy (step)
                        }}
                        onChange={(e) => {
                          setDataUpdateInvoice({
                            ...dataUpdateInvoice,
                            totalReceiver: Number(e.target.value),
                          });
                        }}
                      />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            sx={{ width: "100%", padding: "7px 0" }}
                            label="Ngày nhắc hẹn"
                            value={dayjs.utc(dataUpdateInvoice?.dateRemind)}
                            onChange={(newValue) => {
                              if (newValue) {
                                const temp = newValue?.toDate();
                                setDataUpdateInvoice({
                                  ...dataUpdateInvoice,
                                  dateRemind: temp,
                                });
                              }
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          setOpenDialogUpdateStatusPayment(false);
                        }}
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={() => {
                          handleUpdateStatus();
                        }}
                      >
                        Lưu
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Paper>
              )}
            </CustomTabPanel>
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
