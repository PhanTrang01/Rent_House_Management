"use client";
import styled from "@emotion/styled";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Dashboard from "../components/Dashboard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Toolbar,
} from "@mui/material";
import axios from "axios";
import {
  Guests,
  HomeContract,
  Homeowners,
  Homes,
  Service,
  ServiceContract,
} from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex-grow: 1;
`;

type ContractHome = HomeContract & {
  home: Homes & {
    homeowner: Homeowners;
  };
  guest: Guests;
};

type ContractService = ServiceContract & {
  home: Homes & {
    homeowner: Homeowners;
  };
  guest: Guests;
  service: Service;
};

// Bảng hợp đồng nhà
interface Column {
  id:
    | "owner"
    | "guest"
    | "CCCD_Guest"
    | "address"
    | "duration"
    | "rental"
    | "date_start"
    | "date_end";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "owner", label: "Tên chủ nhà", minWidth: 170 },
  { id: "guest", label: "Tên khách thuê", minWidth: 170 },
  {
    id: "CCCD_Guest",
    label: "Số CCCD khách thuê",
    minWidth: 120,
    align: "right",
  },
  {
    id: "address",
    label: "Căn hộ thuê",
    minWidth: 270,
    align: "right",
    // format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "duration",
    label: "Thời hạn thuê (tháng)",
    minWidth: 90,
    align: "right",
    // format: (value: number) => value.toFixed(2),
  },
  {
    id: "rental",
    label: "Giá thuê (VND/tháng)",
    minWidth: 90,
    align: "right",
  },
  {
    id: "date_start",
    label: "Ngày bắt đầu thuê",
    minWidth: 90,
    align: "right",
  },
  { id: "date_end", label: "Ngày bắt đầu thuê", minWidth: 90, align: "right" },
];

// Bảng hợp đồng dịch vụ

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

export default function SearchPage() {
  const [homeContracts, setHomeContracts] = useState<ContractHome[]>([]);
  const [searchVal, setSearchval] = useState<String>("");
  const [valueTab, setValueTab] = useState(0);

  useEffect(() => {
    axios
      .get(`/api/homeContract?q=${searchVal ?? " "}`)
      .then(function (response) {
        setHomeContracts(response.data);
      });
  }, [searchVal]);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };

  return (
    <>
      <Wrapper>
        <Dashboard />
        <WrapperContainer>
          <Header />
          <br />
          {/* <Typography variant="h5"> Tra cứu hợp đồng </Typography> */}
          <div>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={valueTab}
                onChange={handleChangeTab}
                aria-label="basic tabs example"
              >
                <Tab label="Tra cứu HĐ thuê nhà" value={0} />
                <Tab label="Tra cứu HĐ dịch vụ" value={1} />
              </Tabs>
            </Box>
            <CustomTabPanel value={valueTab} index={0}>
              <Box
                sx={{
                  maxWidth: "100%",
                  margin: "10px 50px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <TextField
                  sx={{
                    width: 400,
                    margin: "0 10px",
                  }}
                  size="small"
                  label="Tìm kiếm hợp đồng"
                  id="search"
                  onChange={(e) => {
                    setSearchval(e.target.value);
                  }}
                />
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<SearchIcon />}
                  >
                    Tìm kiếm
                  </Button>
                </Stack>
              </Box>
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 580 }}>
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
                      {homeContracts
                        //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const dateS = dayjs.utc(row.dateStart);
                          const formattedDateS = dateS.format("DD/MM/YYYY");
                          const dateE = dayjs.utc(row.dateEnd);
                          const formattedDateE = dateE.format("DD/MM/YYYY");
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.homeContractsId}
                            >
                              <TableCell>
                                {row.home.homeowner?.fullname}
                              </TableCell>
                              <TableCell>{row.guest.fullname}</TableCell>
                              <TableCell>{row.guest.citizenId}</TableCell>
                              <TableCell align="right">
                                {row.home.address}
                              </TableCell>
                              <TableCell align="right">
                                {row.duration}
                              </TableCell>
                              <TableCell align="right">
                                {row.rental.toLocaleString("en-EN")}
                              </TableCell>
                              <TableCell align="right">
                                {formattedDateS}
                              </TableCell>
                              <TableCell align="right">
                                {formattedDateE}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
              </Paper>
            </CustomTabPanel>
            <CustomTabPanel value={valueTab} index={1}></CustomTabPanel>
          </div>
          <Footer />
        </WrapperContainer>
      </Wrapper>
    </>
  );
}
