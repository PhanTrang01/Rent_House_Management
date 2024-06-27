"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  HomeContract,
  Homes,
  InvoicesPayment,
  Receiver,
  ServiceContract,
} from "@prisma/client";
import axios from "axios";

dayjs.extend(utc);

type Invoice = InvoicesPayment & {
  home: Homes;
  receiver: Receiver;
  homeContract: HomeContract;
  serviceContract: ServiceContract;
};
interface Column {
  id:
    | "index"
    | "home"
    | "type"
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
  { id: "index", label: "STT", minWidth: 40 },
  { id: "home", label: "Căn hộ", minWidth: 100 },
  { id: "type", label: "Loại", minWidth: 50 },
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
    minWidth: 130,
    align: "right",
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
    minWidth: 200,
    align: "center",
  },
  {
    id: "statusPayment",
    label: "Trạng thái thanh toán",
    minWidth: 170,
    align: "right",
  },
];

const settings = ["Logout"];

export default function Header() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [invoices, setInvoice] = useState<Invoice[]>([]);

  useEffect(() => {
    const usernameStore = localStorage.getItem("username");
    setUsername(usernameStore);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/homepage/remind");
        setInvoice(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: "#8083a6" }}>
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ChanHouse
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            <Badge badgeContent={invoices.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Dialog open={openDialog} maxWidth="xl" fullWidth>
            <DialogTitle>Các đợt thanh toán trong 7 ngày tới</DialogTitle>
            <DialogContent>
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
                          onClick={() => {}}
                        >
                          <TableCell align="center">
                            {`Đợt ${index + 1}`}
                          </TableCell>
                          <TableCell align="center">
                            {row.home?.apartmentNo}-{row.home?.building}
                          </TableCell>
                          <TableCell align="center">{row.type}</TableCell>
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
                            {row.totalReceiver.toString()}
                          </TableCell>
                          <TableCell align="center">
                            {dayjs
                              .utc(row.datePaymentReal.toString())
                              .format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell align="center">
                            {row.totalSend.toString()}
                          </TableCell>
                          <TableCell align="center">
                            {row.receiver.TenTK?.toString()}
                          </TableCell>
                          <TableCell align="center">
                            {row.statusPayment === true ? (
                              <CheckCircleOutlineIcon color="success" />
                            ) : (
                              <RemoveCircleOutlineIcon color="disabled" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpenDialog(false);
                }}
              >
                Đóng
              </Button>
            </DialogActions>
          </Dialog>
          {username ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>{username.charAt(0).toLocaleUpperCase()}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography
                      textAlign="center"
                      onClick={() => {
                        localStorage.removeItem("username");
                        router.push("/login");
                      }}
                    >
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Button
              color="inherit"
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
