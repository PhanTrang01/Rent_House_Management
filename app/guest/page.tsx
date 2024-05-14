"use client";
import styled from "@emotion/styled";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import axios from "axios";
import { Guests } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";

dayjs.extend(utc);

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex-grow: 1;
`;

interface Column {
  id:
    | "fullname"
    | "phone"
    | "email"
    | "citizenId"
    | "cittizen_ngaycap"
    | "cittizen_noicap";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: String) => String;
}

const columns: readonly Column[] = [
  { id: "fullname", label: "Tên chủ nhà", minWidth: 170 },
  { id: "phone", label: "Số Điện thoại", minWidth: 100 },
  {
    id: "email",
    label: "Email",
    minWidth: 170,
    align: "right",
  },
  {
    id: "citizenId",
    label: "Số CCCD",
    minWidth: 170,
    align: "right",
  },
  {
    id: "cittizen_ngaycap",
    label: "Ngày cấp CCCD",
    minWidth: 170,
    align: "right",
  },
  {
    id: "cittizen_noicap",
    label: "Nơi cấp CCCD",
    minWidth: 170,
    align: "right",
  },
];

export default function OtherOption() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guests[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/guest");
        const newGuest = res.data;
        if (newGuest) {
          setGuests(newGuest);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Wrapper>
      <Dashboard />
      <WrapperContainer>
        <Header />
        <Paper>
          <Typography variant="h5" sx={{ margin: "15px" }}>
            Danh sách khách thuê
          </Typography>
          <Button
            sx={{ position: "absolute", right: "20px" }}
            variant="outlined"
            // onClick={handleClickOpen}
          >
            Thêm thông tin khách thuê
          </Button>
          <Paper sx={{ marginTop: "60px", width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 800 }}>
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
                  {guests
                    //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.guestId}
                          onClick={() => {
                            router.push(`/guest/${row.guestId}`);
                          }}
                        >
                          {columns.map((column) => {
                            let value: string | Date | boolean = row[column.id];

                            if (column.id === "cittizen_ngaycap" && value) {
                              value = dayjs
                                .utc(value.toString())
                                .format("DD/MM/YYYY");
                            }
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value.toString()}
                              </TableCell>
                            );
                          })}
                          <TableCell align="center">
                            <IconButton
                            // onClick={() => handleEdit(row.serviceId)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                            // onClick={() => handleDelete(row.serviceId)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={owners.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
          </Paper>
        </Paper>
      </WrapperContainer>
    </Wrapper>
  );
}
