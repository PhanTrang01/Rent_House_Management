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
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Guests, HomeContract, Homeowners, Homes } from "@prisma/client";

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex: 1;
  height: 100hv;
`;

type ContractHome = HomeContract & {
  home: Homes;
  guest: Guests;
};
type InfoHome = Homes & {
  homeowner: Homeowners;
};

interface Data {
  id: number;
  guest: string;
  home: string;
  duration: number;
  rental: number;
  cycle: number;
}
interface Data2 {
  owner: string;
  namehome: string;
  address: string;
  active: boolean;
}
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
//Data hien thi tab Can ho da thue
function createData(
  id: number,
  guest: string,
  home: string,
  duration: number,
  rental: number,
  cycle: number
): Data {
  return {
    id,
    guest,
    home,
    duration,
    rental,
    cycle,
  };
}
//Data hien thi tab Can ho chua thue
function createDataHome(
  owner: string,
  namehome: string,
  address: string,
  active: boolean
) {
  return { owner, namehome, address, active };
}
interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "guest",
    numeric: false,
    disablePadding: true,
    label: "Tên khách thuê",
  },
  {
    id: "home",
    numeric: true,
    disablePadding: false,
    label: "Địa chỉ nhà",
  },
  {
    id: "duration",
    numeric: true,
    disablePadding: false,
    label: "Thời hạn thuê(tháng)",
  },
  {
    id: "rental",
    numeric: true,
    disablePadding: false,
    label: "Giá thuê (VND/tháng)",
  },
  {
    id: "cycle",
    numeric: true,
    disablePadding: false,
    label: "Chu kỳ thanh toán (tháng/lần)",
  },
];
interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function ListRent() {
  const router = useRouter();
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [homeContracts, setHomeContracts] = useState<ContractHome[]>([]);
  const [homes, setHomes] = useState<InfoHome[]>([]);
  const [rows, setRows] = useState<Data[]>([]);
  const [rowHomes, setRowHomes] = useState<Data2[]>([]);
  // const visibleRows = useMemo(
  //     () =>
  //       stableSort(rows, getComparator(order, orderBy)).slice(
  //         page * rowsPerPage,
  //         page * rowsPerPage + rowsPerPage,
  //       ),
  //     [order, orderBy, page, rowsPerPage],
  //   );

  const [valueTab, setValueTab] = useState(0);

  useEffect(() => {
    axios.get("/api/listRent").then(function (response) {
      setHomeContracts(response.data);
    });
    axios.get("/api/homes").then(function (response) {
      setHomes(response.data);
    });
  }, []);

  useEffect(() => {
    const newRows = homeContracts.map((homeContract, index) => {
      let nameGuest: string = homeContract.guest.fullname;
      let addrHome: string = homeContract.home?.address;
      return createData(
        index + 1,
        nameGuest,
        addrHome,
        homeContract.duration,
        homeContract.rental,
        homeContract.payCycle
      );
    });
    setRows(newRows);
  }, [homeContracts]);

  useEffect(() => {
    const newRowHome = homes.map((home, index) => {
      let nameowner: string = home.homeowner.fullname;
      let nameHome: string = home.fullname ? home.fullname : "Unknown";
      return createDataHome(nameowner, nameHome, home.address, home.active);
    });
    setRowHomes(newRowHome);
  }, [homes]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };
  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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
              <Tab label="Căn hộ đã thuê" />
              <Tab label="Căn hộ chưa thuê" />
            </Tabs>
          </Box>
          <CustomTabPanel value={valueTab} index={0}>
            <Toolbar>
              {selected.length > 0 && (
                <Typography
                  sx={{ flex: "1 1 100%" }}
                  color="inherit"
                  component="div"
                >
                  {selected.length} selected
                </Typography>
              )}
              {selected.length > 0 && (
                <Tooltip title="Delete">
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Toolbar>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 750 }}>
                <EnhancedTableHead
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  rowCount={rows.length}
                />
                <TableBody>
                  {rows.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.guest}
                        </TableCell>
                        <TableCell align="right">{row.home}</TableCell>
                        <TableCell align="right">{row.duration}</TableCell>
                        <TableCell align="right">{row.rental}</TableCell>
                        <TableCell align="right">{row.cycle}</TableCell>
                      </TableRow>
                    );
                  })}
                  {/* {emptyRows > 0 && (
                <TableRow
                  style={{
                    // height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>
          <CustomTabPanel value={valueTab} index={1}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên Căn hộ</TableCell>
                    <TableCell align="right">Tên Chủ nhà</TableCell>
                    <TableCell align="right">Địa chỉ Căn hộ</TableCell>
                    <TableCell align="right">Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowHomes.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.namehome}
                      </TableCell>
                      <TableCell align="right">{row.owner}</TableCell>
                      <TableCell align="right">{row.address}</TableCell>
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

        <Footer />
      </WrapperContainer>
    </Wrapper>
  );
}
