"use client";
import styled from "@emotion/styled";
import Dashboard from "../../../components/Dashboard";
import Header from "../../../components/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import { Guests, HomeContract, Homeowners, Homes } from "@prisma/client";
import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";

const Wrapper = styled.div`
  display: flex;
`;

const WrapperContainer = styled.div`
  flex-grow: 1;
`;

type ContractInfo = HomeContract & {
  home: Homes & {
    homeowner: Homeowners;
  };
  guest: Guests;
};

type HomeContractForm = {};

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

export default function HomeContracts({ params }: { params: { id: string } }) {
  const [valueTab, setValueTab] = useState(0);
  const [homeContract, setHomeContract] = useState<ContractInfo>();
  const [homeContractForm, setHomeContractForm] = useState<HomeContractForm>();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);
  };

  return (
    <Wrapper>
      <Dashboard />
      <WrapperContainer>
        <Header />
        <Paper
          elevation={3}
          sx={{
            textAlign: "center",
            padding: " 20px 30px",
            margin: "10px",
          }}
        >
          <Typography variant="h6">Hợp đồng căn hộ </Typography>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={valueTab}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Thông tin chi tiết hợp đồng" value={0} />
                <Tab label="Danh sách hợp đồng dịch vụ" value={1} />
              </Tabs>
            </Box>

            <CustomTabPanel value={valueTab} index={0}></CustomTabPanel>
            <CustomTabPanel value={valueTab} index={1}></CustomTabPanel>
          </Box>
        </Paper>
      </WrapperContainer>
    </Wrapper>
  );
}
