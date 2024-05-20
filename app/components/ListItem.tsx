import * as React from "react";
import styled from "@emotion/styled";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import SearchIcon from "@mui/icons-material/Search";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import ApartmentIcon from "@mui/icons-material/Apartment";
import Link from "next/link";

// const ItemIcon = styled(ListItemIcon)`
//   background-color: white;
//   /* border-radius: 50%; // Để làm cho nền hình tròn */
// `;

export const mainListItems = (
  <React.Fragment>
    <Link href="/homepage">
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon sx={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Tổng quát" />
      </ListItemButton>
    </Link>
    <Link href="/homes">
      <ListItemButton>
        <ListItemIcon>
          <ApartmentIcon sx={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Quản lý Căn hộ" />
      </ListItemButton>
    </Link>
    <Link href="/owners">
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon sx={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Quản lý chủ nhà" />
      </ListItemButton>
    </Link>
    <Link href="/guest ">
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon sx={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Quản lý khách thuê" />
      </ListItemButton>
    </Link>
    <Link href="/searchPage ">
      <ListItemButton>
        <ListItemIcon>
          <SearchIcon sx={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Tra cứu hợp đồng" />
      </ListItemButton>
    </Link>
    <Link href="/otherOption ">
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon sx={{ color: "white" }} />
        </ListItemIcon>
        <ListItemText primary="Hệ Thống" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);
