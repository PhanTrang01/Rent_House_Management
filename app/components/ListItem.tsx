import * as React from "react";
import styled from "@emotion/styled";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
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
    <Link href="/ListRent">
      <ListItemButton>
        <ListItemIcon>
          <ShoppingCartIcon sx={{ color: "white" }} />
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
    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon sx={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Quản lý khách thuê" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <LayersIcon sx={{ color: "white" }} />
      </ListItemIcon>
      <ListItemText primary="Hệ Thống" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    {/* <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader> */}
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);
