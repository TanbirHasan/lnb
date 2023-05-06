import React, { useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import PaymentIcon from "@mui/icons-material/Payment";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import PeopleIcon from "@mui/icons-material/People";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import SettingsIcon from "@mui/icons-material/Settings";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Logo from "../../public/assets/logo.png";
import Notification from "../../public/assets/notification.png";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import {
  Avatar,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import Cookies from "js-cookie";
import AppBar from "@mui/material/AppBar";
import { useRouter } from "next/router";

const drawerWidth = 240;

const Dashboard = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const route = useRouter();

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("isVerified");
    localStorage.removeItem("userId");
    route.push("/auth/login");
  };
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // defining drawer
  const drawer = (
    <div>
      <div className="py-10 px-5">
        <Image src={Logo} alt="logo" className="max-w-full h-auto" />
      </div>

      <List>
        <ListItem
          className={`${
            route.pathname === "/dashboard/overview"
              ? "border-4 border-l-[#3294D1] border-t-0 border-r-0 border-b-0 rounded"
              : ""
          }`}
        >
          <Link href="/dashboard/overview">
            <ListItemButton>
              <ListItemIcon className="flex items-center">
                <span
                  className={`${
                    route.pathname === "/dashboard/overview"
                      ? "text-[#3294D1]"
                      : ""
                  }`}
                >
                  <AutoAwesomeMosaicIcon />
                </span>
              </ListItemIcon>

              <h3
                className={`font-semibold text-xl font-sans ${
                  route.pathname === "/dashboard/overview"
                    ? "text-[#3294D1]"
                    : ""
                }`}
              >
                Overview
              </h3>
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem
          className={`${
            route.pathname === "/dashboard/users"
              ? "border-4 border-l-[#3294D1] border-t-0 border-r-0 border-b-0 rounded"
              : ""
          }`}
        >
          <Link href="/dashboard/users">
            <ListItemButton>
              <ListItemIcon className="flex items-center">
                <span
                  className={`${
                    route.pathname === "/dashboard/users"
                      ? "text-[#3294D1]"
                      : ""
                  }`}
                >
                  <PeopleIcon />
                </span>
              </ListItemIcon>

              <h3
                className={`font-semibold text-xl font-sans ${
                  route.pathname === "/dashboard/users" ? "text-[#3294D1]" : ""
                }`}
              >
                User List
              </h3>
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem
          className={`${
            route.pathname === "/dashboard/allpayments" ||
            route.pathname === "/dashboard/paymenthistory/[slug]"
              ? "border-4 border-l-[#3294D1] border-t-0 border-r-0 border-b-0 rounded"
              : ""
          }`}
        >
          <Link href="/dashboard/allpayments">
            <ListItemButton>
              <ListItemIcon className="flex items-center">
                <span
                  className={`${
                    route.pathname === "/dashboard/allpayments"
                      ? "text-[#3294D1]"
                      : ""
                  }`}
                >
                  <PaymentIcon />
                </span>
              </ListItemIcon>

              <h3
                className={`font-semibold text-[18px] font-sans ${
                  route.pathname === "/dashboard/allpayments"
                    ? "text-[#3294D1]"
                    : ""
                }`}
              >
                Payment
              </h3>
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem
          className={`${
            route.pathname === "/dashboard/settings"
              ? "border-4 border-l-[#3294D1] border-t-0 border-r-0 border-b-0 rounded"
              : ""
          }`}
        >
          <Link href="/dashboard/settings">
            <ListItemButton>
              <ListItemIcon className="flex items-center">
                <span
                  className={`${
                    route.pathname === "/dashboard/settings"
                      ? "text-[#3294D1]"
                      : ""
                  }`}
                >
                  <SettingsIcon />
                </span>
              </ListItemIcon>
              <h3
                className={`font-semibold text-xl font-sans ${
                  route.pathname === "/dashboard/settings"
                    ? "text-[#3294D1]"
                    : ""
                }`}
              >
                Settings
              </h3>
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem

        // className={`${
        //   route.pathname === "/dashboard/exit"
        //     ? "border-4 border-l-indigo-600"
        //     : ""
        // }`}
        >
          <ListItemButton onClick={logout}>
            <ListItemIcon className="flex items-center">
              <span>
                <ExitToAppIcon />
              </span>
            </ListItemIcon>
            <h3 className="font-semibold text-xl font-sans ">Logout</h3>
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className="dashboard">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: "white",
            boxShadow: 1,
          }}
        >
          <Toolbar>
            <IconButton
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="fingerprint"
              color="secondary"
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <Box display="flex" flexGrow="1"></Box>
            <Box>
              <Tooltip title="Open settings">
                <button
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0 }}
                  className="flex items-center"
                >
                  <Image src={Notification} />
                  <Avatar
                    alt="Remy Sharp"
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80"
                    className="mx-3 rounded-lg"
                  />
                </button>
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
                <MenuItem
                  onClick={handleCloseUserMenu}
                  className="flex flex-col gap-y-4 item-start justify-start"
                >
                  <Link href="/">
                    <button className="flex gap-2 items-center w-full hover:text-[#d5783f]">
                      <HomeIcon />
                      Home
                    </button>
                  </Link>

                  <button
                    className="flex gap-2 items-center w-full hover:text-[#d5783f]"
                    onClick={logout}
                  >
                    <LogoutIcon />
                    Logout
                  </button>

                  {/* <Typography textAlign="center" className="flex items-center">
                    <HomeIcon />

                    <Link href="/"> Home</Link>
                  </Typography>
                  <Typography textAlign="center" onClick={logout}>
                    Logout
                  </Typography> */}
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(!mobileOpen)}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Container className="pt-10 ">{children}</Container>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
