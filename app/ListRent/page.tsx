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
  Button,
  Checkbox,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex: 1;
  height: 100hv;
`;

interface Data {
  id: number;
  guest: string;
  owner: string;
  home: string;
  duration: number;
  rental: number;
  cycle: number;
}

function createData(
  id: number,
  guest: string,
  owner: string,
  home: string,
  duration: number,
  rental: number,
  cycle: number
): Data {
  return {
    id,
    guest,
    owner,
    home,
    duration,
    rental,
    cycle,
  };
}

const rows = [
  createData(1, "Cupcake1", "Cupcake", "305", 3.7, 67, 4.3),
  createData(2, "Cupcake", "Donut", "452", 25.0, 51, 4.9),
  createData(3, "Cupcake", "Eclair", "262", 16.0, 24, 6.0),
  createData(4, "Cupcake", "Frozen yoghurt", "159", 6.0, 24, 4.0),
  createData(5, "Cupcake", "Gingerbread", "356", 16.0, 49, 3.9),
  createData(6, "Cupcake", "Honeycomb", "408", 3.2, 87, 6.5),
];

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
    id: "owner",
    numeric: true,
    disablePadding: false,
    label: "Tên chủ nhà",
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
    label: "Hạn thuê",
  },
  {
    id: "rental",
    numeric: true,
    disablePadding: false,
    label: "Giá thuê (1 tháng)",
  },
  {
    id: "cycle",
    numeric: true,
    disablePadding: false,
    label: "Chu kỳ thanh toán",
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
  // const visibleRows = useMemo(
  //     () =>
  //       stableSort(rows, getComparator(order, orderBy)).slice(
  //         page * rowsPerPage,
  //         page * rowsPerPage + rowsPerPage,
  //       ),
  //     [order, orderBy, page, rowsPerPage],
  //   );
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
            Add Owner
          </Button>
        </Typography>

        <Toolbar>
          {selected.length > 0 && (
            <Typography
              sx={{ flex: "1 1 100%" }}
              color="inherit"
              variant="subtitle1"
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
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            // size={dense ? 'small' : 'medium'}
          >
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
                    <TableCell align="right">{row.owner}</TableCell>
                    <TableCell align="right">{row.home}</TableCell>
                    <TableCell align="right">{row.rental}</TableCell>
                    <TableCell align="right">{row.duration}</TableCell>
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
        <Footer />
      </WrapperContainer>
    </Wrapper>
  );
}
