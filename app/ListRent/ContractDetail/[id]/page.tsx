"use client";
import Dashboard from "../../../components/Dashboard";
import Footer from "../../../components/Footer";
import styled from "@emotion/styled";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Header from "../../../components/Header";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useMemo, useState } from "react";
import { InvoicesPayment } from "@prisma/client";
import { useRouter } from "next/navigation";

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex: 1;
  height: 100hv;
`;
const Item = styled(Paper)(() => ({
  backgroundColor: "#f5f5fb",
  padding: "7px",
  textAlign: "center",
}));

type Invoice = InvoicesPayment;

interface Data {
  id: number;
  guest: string;
  owner: string;
  home: string;
  duration: number;
  rental: number;
  cycle: number;
}
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
interface Column {
  id: "fullName" | "phone" | "citizenId" | "active";
  label: string;
  minWidth?: number;
  align?: "right";
}

const columns: readonly Column[] = [
  { id: "fullName", label: "Tên chủ nhà", minWidth: 170 },
  { id: "phone", label: "Số Điện thoại", minWidth: 100 },
  {
    id: "citizenId",
    label: "citizenID",
    minWidth: 170,
    align: "right",
  },
  {
    id: "active",
    label: "Trạng thái",
    minWidth: 170,
    align: "right",
  },
];
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

export default function ContractDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [valueTab, setValueTab] = useState(0);
  const [invoices, setInvoice] = useState<InvoicesPayment[]>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
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
          <Button
            sx={{ position: "absolute", right: "20px" }}
            variant="outlined"
            onClick={() => router.push("ListRent/AddRent")}
          >
            Thêm hợp đồng thuê nhà mới
          </Button>
        </Typography>

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={valueTab}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Danh sách Hợp đồng Căn hộ" />
              <Tab label="Danh sách Thanh toán" />
            </Tabs>
          </Box>
          <CustomTabPanel value={valueTab} index={0}>
            <Paper
              sx={{
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6">Chi tiết hợp đồng thuê nhà</Typography>
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
                      id="outlined-read-only-input"
                      label="Read Only"
                      defaultValue="Hello World"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Item>
                </Grid>
                <Grid item lg={5}>
                  <Item>
                    <TextField
                      id="outlined-read-only-input"
                      label="Read Only"
                      defaultValue="Hello World"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Item>
                </Grid>
                <Grid item lg={5}>
                  <Item>
                    <TextField
                      id="outlined-read-only-input"
                      label="Read Only"
                      defaultValue="Hello World"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Item>
                </Grid>
                <Grid item lg={2.5}>
                  <Item>
                    <TextField
                      id="outlined-read-only-input"
                      label="Read Only"
                      defaultValue="Hello World"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Item>
                </Grid>
                <Grid item lg={2.5}>
                  <Item></Item>
                </Grid>
                <Grid item lg={2.5}>
                  <Item></Item>
                </Grid>
                <Grid item lg={2.5}>
                  <Item></Item>
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
                    />
                  </Item>
                </Grid>
                <Grid item lg={5}>
                  <Item></Item>
                </Grid>
              </Grid>
            </Paper>
            <br />
            <Paper>
              <Typography variant="h6">
                Chi tiết các hợp đồng dịch vụ
              </Typography>
            </Paper>
          </CustomTabPanel>
          <CustomTabPanel value={valueTab} index={1}>
            Item Two
          </CustomTabPanel>
        </Box>

        <Footer />
      </WrapperContainer>
    </Wrapper>
  );
}
