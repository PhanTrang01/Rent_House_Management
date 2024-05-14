"use client";
import styled from "@emotion/styled";
import Dashboard from "../components/Dashboard";
import Header from "../components/Header";
import {
  Box,
  Button,
  IconButton,
  Paper,
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
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { Receiver, Service } from "@prisma/client";
import axios from "axios";

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex-grow: 1;
`;
//Bang dich vu
interface Column {
  id: "serviceId" | "name" | "unit" | "description";
  label: string;
  minWidth?: number;
  align?: "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "serviceId", label: "Mã dịch vụ", minWidth: 40, align: "center" },
  { id: "name", label: "Tên dịch vụ", minWidth: 170, align: "center" },
  {
    id: "unit",
    label: "Đơn vị tính",
    minWidth: 100,
    align: "center",
  },
  {
    id: "description",
    label: "Mô tả",
    minWidth: 270,
    // format: (value: number) => value.toLocaleString("en-US"),
  },
];

//Bang nguoi nhan
interface ColumnReceiver {
  id: "name" | "phone" | "email" | "taxcode" | "STK" | "TenTK" | "Nganhang";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columnReceivers: readonly ColumnReceiver[] = [
  { id: "name", label: "Tên chủ TK", minWidth: 150 },
  { id: "phone", label: "Số Điện thoại", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 150 },
  { id: "taxcode", label: "Mã số thuế", minWidth: 150 },
  {
    id: "STK",
    label: "Số tài khoản",
    minWidth: 170,
    align: "right",
  },
  {
    id: "TenTK",
    label: "Tên tài khoản",
    minWidth: 170,
    align: "right",
  },
  {
    id: "Nganhang",
    label: "Tên ngân hàng",
    minWidth: 170,
    align: "right",
  },
];

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

export default function OtherOption() {
  const [option, setOption] = useState(0);
  const [searchVal, setSearchval] = useState<String>("");
  const [dataServices, setDataServices] = useState<Service[]>([]);
  const [dataReceivers, setDataReceivers] = useState<Receiver[]>([]);

  const handleEdit = (id: Number) => {};
  const handleDelete = (id: Number) => {
    // setSelectedRecord(id);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setOption(newValue);
  };

  React.useEffect(() => {
    axios.get("/api/serviceO").then(function (response) {
      setDataServices(response.data);
    });

    axios.get("/api/receiver").then(function (response) {
      setDataReceivers(response.data);
    });
  }, []);

  return (
    <Wrapper>
      <Dashboard />
      <WrapperContainer>
        <Header />
        <Paper>
          <Typography variant="h5" sx={{ margin: "15px" }}>
            Danh mục hệ thống
          </Typography>
          <Box sx={{ width: "100%" }}>
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
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={option}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Dịch vụ" tabIndex={0} />
                <Tab label="Người nhận thanh toán" tabIndex={1} />
              </Tabs>
            </Box>
            <CustomTabPanel value={Number(option)} index={0}>
              <Paper>
                <TableContainer sx={{ maxHeight: 580 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align="center"
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
                      {dataServices
                        //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.serviceId}
                            >
                              {columns.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {value}
                                  </TableCell>
                                );
                              })}
                              <TableCell align="center">
                                <IconButton
                                  onClick={() => handleEdit(row.serviceId)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDelete(row.serviceId)}
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
              </Paper>
            </CustomTabPanel>
            <CustomTabPanel value={Number(option)} index={1}>
              <Paper>
                <TableContainer sx={{ maxHeight: 580 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columnReceivers.map((column) => (
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
                      {dataReceivers
                        //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.receiverId}
                            >
                              {columnReceivers.map((column) => {
                                const value = row[column.id];
                                return (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                  >
                                    {value}
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
              </Paper>
            </CustomTabPanel>
          </Box>
        </Paper>
      </WrapperContainer>
    </Wrapper>
  );
}
