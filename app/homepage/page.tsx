"use client";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { BarChart, LineChart, PieChart, axisClasses } from "@mui/x-charts";
import Dashboard from "../components/Dashboard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import { log } from "console";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
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
import { Gideon_Roman } from "next/font/google";

const Wrapper = styled.div`
  display: flex;
`;

// const WrapperDashboard = styled(Dashboard)`
//   position: fixed;
// `;

const WrapperContainer = styled.div`
  flex-grow: 1;
`;

type FetchData = {
  totalHomes: number;
  totalHomeContracts: number;
  totalSContracts: number;
  totalInvoices: number;
  totalSendSum: number;
  totalReceiverSum: number;
};

type CountContract = {
  month: String;
  count: number;
};

type CountInvoice = {
  month: String;
  homeCount: number;
  serviceCount: number;
  totalSend: number;
  totalReceiver: number;
};

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
  { id: "index", label: "STT", minWidth: 40 },
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

export default function Homepage() {
  const [xLabels, setxLabels] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ]);
  const [data, setData] = useState<FetchData>();
  const [difference, setDifference] = useState(0);

  const [dataCountContract, setDataCountContract] = useState<CountContract[]>(
    []
  );
  const [dataCountInvoice, setDataCountInvoice] = useState<CountInvoice[]>([]);

  const contractData = useMemo(() => [4, 0, 2, 0, 1, 0, 0, 2, 2, 3, 1, 0], []);

  const homeInvoiceData = useMemo(
    () => [4, 0, 2, 0, 1, 0, 0, 2, 2, 3, 1, 0],
    []
  );
  const serviceInvoiceData = useMemo(
    () => [4, 0, 2, 0, 1, 0, 0, 2, 2, 3, 1, 0],
    []
  );

  const totalSend = useMemo(
    () => [400000, 0, 0, 0, 100000, 0, 0, 0, 0, 0, 0, 0],
    []
  );
  const totalReceiver = useMemo(
    () => [0, 0, 20000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/homepage");
        setData(res.data);
        setDifference(res.data.totalReceiverSum - res.data.totalSendSum);
      } catch (error) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resContract = await axios.get("/api/homepage/countContract");
        setDataCountContract(resContract.data);
        resContract.data.forEach((item: CountContract, index: number) => {
          contractData[index] = item.count;
        });

        const resInvoice = await axios.get("/api/homepage/countInvoice");
        setDataCountInvoice(resInvoice.data);
        resInvoice.data.forEach((item: CountInvoice, index: number) => {
          homeInvoiceData[index] = item.homeCount;
          serviceInvoiceData[index] = item.serviceCount;
          totalSend[index] = item.totalSend;
          totalReceiver[index] = item.totalReceiver;
        });
      } catch (error) {}
    };
    fetchData();

    // dataCountInvoice
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [dataPlot2, setDataPlot2] = useState({ value1: 1, value2: 2 });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resTrue = await axios.get(`/api/homes?status=true`);
        const resFalse = await axios.get(`/api/homes?status=false`);
        setDataPlot2({
          value1: resFalse.data.length,
          value2: resTrue.data.length,
        });
        console.log({
          value1: resFalse.data.length,
          value2: resTrue.data.length,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    console.log(dataPlot2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Wrapper>
        <Dashboard />
        <WrapperContainer>
          <Header />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
              // margin: "5px",
            }}
          >
            {/*<Toolbar />*/}

            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item md={12} lg={7}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 280,
                    }}
                  >
                    <Typography variant="h6">
                      Thống kê số lượng hợp đồng 2024
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item lg={6} xs={6} style={{ height: "50%" }}>
                        <Item>
                          <Grid container alignItems="center" spacing={4}>
                            <Grid item>
                              <HomeIcon sx={{ fontSize: "50px" }} />
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="h2"
                                style={{
                                  fontWeight: "bold",
                                  fontFamily: "Times New Roman",
                                }}
                              >
                                {data?.totalHomes}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="h5">Số căn hộ</Typography>
                            </Grid>
                          </Grid>
                        </Item>
                      </Grid>
                      <Grid item lg={6} xs={6} style={{ height: "50%" }}>
                        <Item>
                          <Grid container alignItems="center" spacing={4}>
                            <Grid item>
                              <HomeIcon sx={{ fontSize: "50px" }} />
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="h2"
                                style={{
                                  fontWeight: "bold",
                                  fontFamily: "Times New Roman",
                                }}
                              >
                                {data?.totalHomeContracts}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="h5">Số HĐ căn hộ</Typography>
                            </Grid>
                          </Grid>
                        </Item>
                      </Grid>
                      <Grid item lg={6} xs={6} style={{ height: "50%" }}>
                        <Item>
                          <Grid container alignItems="center" spacing={4}>
                            <Grid item>
                              <HomeIcon sx={{ fontSize: "50px" }} />
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="h2"
                                style={{
                                  fontWeight: "bold",
                                  fontFamily: "Times New Roman",
                                }}
                              >
                                {data?.totalSContracts}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="h5">Số HĐDV</Typography>
                            </Grid>
                          </Grid>
                        </Item>
                      </Grid>
                      <Grid item lg={6} xs={6} style={{ height: "50%" }}>
                        <Item>
                          <Grid container alignItems="center" spacing={4}>
                            <Grid item>
                              <HomeIcon sx={{ fontSize: "50px" }} />
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="h2"
                                style={{
                                  fontWeight: "bold",
                                  fontFamily: "Times New Roman",
                                }}
                              >
                                {data?.totalInvoices}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="h5">
                                Số HĐ thanh toán
                              </Typography>
                            </Grid>
                          </Grid>
                        </Item>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item md={12} lg={5}>
                  <Paper
                    sx={{
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      height: 280,
                    }}
                  >
                    <Typography variant="h6">
                      Thống kê số lượng BĐS đã thuê
                    </Typography>

                    <PieChart
                      series={[
                        {
                          data: [
                            {
                              id: 0,
                              value: dataPlot2.value1,
                              label: "Đã cho thuê",
                            },
                            {
                              id: 1,
                              value: dataPlot2.value2,
                              label: "Chưa cho thuê",
                            },
                          ],
                        },
                      ]}
                    />
                  </Paper>
                </Grid>
                <Grid item lg={6}>
                  <Item>
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: 300,
                      }}
                    >
                      <Typography variant="h6">
                        Giá trị các đợt thanh toán theo tháng
                      </Typography>
                      <LineChart
                        margin={{ left: 78 }}
                        series={[
                          { data: totalSend, label: "Giá trị nộp ra" },
                          {
                            data: totalReceiver,
                            label: "Giá trị thu vào",
                            color: "blue",
                          },
                        ]}
                        xAxis={[
                          {
                            scaleType: "point",
                            data: xLabels,
                            label: "Tháng (2024)",
                          },
                        ]}
                        yAxis={[{ label: "VND" }]}
                        sx={{
                          [`.${axisClasses.left} .${axisClasses.label}`]: {
                            transform: "translate(-28px, 0)",
                          },
                          // paddingLeft: "10px",
                        }}
                      />
                      {/* ) : null} */}
                    </Paper>
                  </Item>
                </Grid>
                <Grid item lg={6}>
                  <Item>
                    <Paper
                      sx={{
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                        height: 300,
                      }}
                    >
                      <Typography variant="h6">
                        Số lượng HĐ và đợt thanh toán theo tháng
                      </Typography>
                      <BarChart
                        xAxis={[
                          {
                            scaleType: "band",
                            data: xLabels,
                            label: "Tháng (2024)",
                          },
                        ]}
                        series={[
                          {
                            data: contractData,
                            // dataKey: "HĐ",
                            label: "Hợp Đồng",
                          },
                          { data: homeInvoiceData, label: "Thanh toán CH" },
                          { data: serviceInvoiceData, label: "Thanh toán DV" },
                        ]}
                        // width={500}
                        // height={300}
                      />
                      {/* <LineChart
                        series={[
                          { data: pData, label: "HĐ điện" },
                          { data: uData, label: "HĐ dịch vụ", color: "blue" },
                        ]}
                        xAxis={[
                          {
                            scaleType: "point",
                            data: xLabels,
                            label: "label-X",
                          },
                        ]}
                        yAxis={[{ label: "VND" }]}
                        sx={{
                          [`.${axisClasses.left} .${axisClasses.label}`]: {
                            transform: "translate(-12px, 0)",
                          },
                          marginLeft: "30px",
                        }}
                      /> */}
                    </Paper>
                  </Item>
                </Grid>
                <Grid item lg={12}>
                  <Paper
                    sx={{
                      p: 2,
                    }}
                  >
                    <Typography variant="h5"> Tổng giá trị HĐ</Typography>
                    <Grid container spacing={2}>
                      <Grid item lg={4}>
                        <Item>
                          <Grid container alignItems="center" spacing={8}>
                            <Grid item>Tổng giá trị thanh toán thu vào</Grid>

                            <Grid item>
                              <Typography variant="h6">
                                {data?.totalReceiverSum.toLocaleString("en-EN")}{" "}
                                VNĐ
                              </Typography>
                            </Grid>
                          </Grid>
                        </Item>
                      </Grid>
                      <Grid item lg={4}>
                        <Item>
                          <Grid container alignItems="center" spacing={8}>
                            <Grid item>Tổng giá trị thanh toán nộp ra</Grid>

                            <Grid item>
                              <Typography variant="h6">
                                {data?.totalSendSum.toLocaleString("en-EN")} VNĐ
                              </Typography>
                            </Grid>
                          </Grid>
                        </Item>
                      </Grid>
                      <Grid item lg={4}>
                        <Item>
                          <Grid container alignItems="center" spacing={8}>
                            <Grid item>Chênh lệch</Grid>

                            <Grid item>
                              <Typography variant="h6">
                                {difference.toLocaleString("en-EN")} VNĐ
                              </Typography>
                            </Grid>
                          </Grid>
                        </Item>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                {/* <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    <Typography variant="h6">
                      Các đợt thanh toán trong 7 ngày tới
                    </Typography>
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
                          {/* {sInvoices.map((row, index) => {
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
                  </Paper>
                </Grid> */}
              </Grid>
            </Container>
          </Box>
          <Footer />
        </WrapperContainer>
      </Wrapper>
    </>
  );
}

const Item = styled(Paper)(() => ({
  backgroundColor: "#fcfafd",
  padding: "5px",
  textAlign: "left",
}));
