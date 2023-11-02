"use client";
import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { LineChart, PieChart, axisClasses } from "@mui/x-charts";
import Dashboard from "../components/Dashboard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Typography from "@mui/material/Typography";
import { log } from "console";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  display: flex;
`;

// const WrapperDashboard = styled(Dashboard)`
//   position: fixed;
// `;

const WrapperContainer = styled.div`
  flex-grow: 1;
`;

export default function Homepage() {
  const [xLabels, setxLabels] = useState<number[]>([]);
  const uData = [
    4000, 3000, 2000, 2780, 1890, 2390, 3490, 2080, 2890, 2390, 1800,
  ];
  const pData = [
    2400, 1398, 9800, 3908, 4800, 3800, 4300, 2780, 1890, 2390, 2000,
  ];
  useEffect(() => {
    const lMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const CurrentMonth = new Date().getMonth();
    console.log(CurrentMonth);
    const newxLabels = xLabels.concat(
      lMonth.slice(CurrentMonth),
      lMonth.slice(0, CurrentMonth)
    );
    setxLabels(newxLabels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency

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
              margin: "5px",
            }}
          >
            {/*<Toolbar />*/}

            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item md={12} lg={8}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 300,
                    }}
                  >
                    <Typography variant="h6">
                      Thống kê giá trị hóa đơn
                    </Typography>
                    {xLabels.length > 0 ? (
                      <LineChart
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
                      />
                    ) : null}
                  </Paper>
                </Grid>
                <Grid item md={12} lg={4}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 300,
                    }}
                  >
                    <Typography variant="h6">
                      Thống kê số lượng BĐS đã thuê
                    </Typography>

                    <PieChart
                      series={[
                        {
                          data: [
                            { id: 0, value: 10, label: "Đã cho thuê" },
                            { id: 1, value: 15, label: "Chưa cho thuê" },
                          ],
                        },
                      ]}
                    />
                  </Paper>
                </Grid>
                Recent Orders
                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column" }}
                  >
                    Orderrrr
                    {/* <Orders /> */}
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </Box>
          <Footer />
        </WrapperContainer>
      </Wrapper>
    </>
  );
}
