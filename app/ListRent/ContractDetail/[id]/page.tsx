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
  IconButton,
  Tab,
  Tabs,
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
              <Tab label="Hợp đồng Thuê Căn hộ" />
              <Tab label="Hợp đồng dịch vụ" />
            </Tabs>
          </Box>
          <CustomTabPanel value={valueTab} index={0}>
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.homeContractId}
                        >
                          {/* {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })} */}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
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
