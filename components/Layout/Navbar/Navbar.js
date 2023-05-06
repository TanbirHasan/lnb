import * as React from "react";
import { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import logo from "../../../public/assets/logo.png";
import Link from "next/link";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import Search from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import NoLogo from "../../../public/assets/noimage.png";
import apiClient from "../../../library/apis/api-client";
import { Avatar, Divider } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { senderDataRecoil } from "../../../store/atoms/senderDataRecoil";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

function Navbar(props) {
  const color = props.colour;
  const router = useRouter();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [senderData, setSenderdata] = useRecoilState(senderDataRecoil);
  const [data, setData] = React.useState();
  const [auth, setAuth] = React.useState(false);

  const token = Cookies.get("token");

  React.useEffect(() => {
    if (token) {
      setAuth(true);
    }
    // else {
    //   router.push('/auth/login');
    // }
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    setAuth(false);
    Cookies.remove("token");
    Cookies.remove("isVerified");
    localStorage.removeItem("userId");
    localStorage.removeItem("senderDataRecoil");
    setSenderdata({});
    localStorage.removeItem("formStateRecoil");

    router.push("/auth/login");
  };

  const getProfileData = async () => {
    const res = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/self/profile`
    );
    if (res.status === 200) {
      setData(res?.data?.data);
    }
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (token) {
      getProfileData().then((r) => r);
    }
  }, [token]);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ul className="flex flex-col items-center">
          <button
            className={`headline7 menu-link link-hover my-3 w-3/4  flex items-center ${
              router.pathname === "/" ? "nav-active" : ""
            }`}
          >
            <span className="mr-4">
              <Search />
            </span>
            <Link href="/">Start Searching</Link>
          </button>

          <button
            className={`headline7 menu-link link-hover w-3/4 my-3  flex items-center ${
              router.pathname === "/about" ? "nav-active" : ""
            }`}
          >
            <span className="mr-4">
              {" "}
              <InfoIcon />
            </span>

            <Link href="/about">About</Link>
          </button>

          <button
            className={`headline7 menu-link link-hover w-3/4 my-3  flex items-center ${
              router.pathname === "/contact" ? "nav-active" : ""
            }`}
          >
            <span className="mr-4">
              {" "}
              <ContactMailIcon />
            </span>

            <Link href="/contact">Contact</Link>
          </button>

          <button
            className={`headline7 menu-link link-hover w-3/4 my-3  flex items-center ${
              router.pathname === "/profile" ? "nav-active" : ""
            }`}
          >
            <span className="mr-4">
              {" "}
              <AccountBoxIcon />
            </span>

            <Link href="/profile">My Profile</Link>
          </button>
          {data?.isAdmin === true && (
            <Link href="/dashboard/overview">
              <button className="headline7 menu-link link-hover w-3/4 my-3  flex items-center">
                <span className="mr-4">
                  {" "}
                  <DashboardIcon />
                </span>
                Dashboard
              </button>
            </Link>
          )}

          {!auth ? (
            <button
              className={`headline7 menu-link link-hover w-3/4 my-3  flex items-center ${
                router.pathname === "/auth/login" ? "nav-active" : ""
              }`}
            >
              <span className="mr-4">
                {" "}
                <LoginIcon />
              </span>

              <Link href="/auth/login">Login</Link>
            </button>
          ) : (
            <button
              className={`headline7 menu-link link-hover w-3/4 my-3  flex items-center`}
              onClick={logout}
            >
              <span className="mr-4">
                {" "}
                <Logout />
              </span>

              <span>Logout</span>
            </button>
          )}
        </ul>
      </List>
    </Box>
  );

  return (
    <div className="header" style={{ backgroundColor: color }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link href="/">
              <img
                src="/assets/logo.png"
                alt="logo"
                className="cursor-pointer h-[50px] "
              />
            </Link>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <button
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawer("right", true)}
              >
                <MenuIcon style={{ color: "black" }} />
              </button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem onClick={handleCloseNavMenu}></MenuItem>
              </Menu>
            </Box>
            {/* <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography> */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <ul className="hidden lg:flex ">
                <Link href="/">
                  <button
                    className={`headline7 menu-link link-hover ${
                      router.pathname === "/" ? "nav-text-active" : ""
                    }`}
                  >
                    Start Search
                  </button>
                </Link>
                <Link href="/about">
                  <button
                    className={`headline7 menu-link link-hover  ${
                      router.pathname === "/about" ? "nav-text-active" : ""
                    }`}
                  >
                    About
                  </button>
                </Link>
                <Link href="/contact">
                  <button
                    className={`headline7 menu-link link-hover ${
                      router.pathname === "/contact" ? "nav-text-active" : ""
                    }`}
                  >
                    Contact
                  </button>
                </Link>

                {!auth && (
                  <Link href="/auth/login">
                    <button
                      className={`headline7 menu-link login-nav  ${
                        router.pathname === "/auth/login" ? "nav-active" : ""
                      }`}
                    >
                      Login
                    </button>
                  </Link>
                )}
              </ul>
            </Box>
            {auth && (
              <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
                <Tooltip title="Profile">
                  <button onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {!!data?.logoUrl && (
                      <Image
                        loader={() =>
                          `https://lnb-data.s3.eu-west-2.amazonaws.com/logos/${data?.logoUrl}`
                        }
                        src={`https://lnb-data.s3.eu-west-2.amazonaws.com/logos/${data?.logoUrl}`}
                        width={40}
                        height={40}
                        alt="logo text"
                        className="mt-[-30px] md:mx-6 mx-3  border rounded-full bg-white md:w-[176px] md:h-[176px] w-[120px] h-[120px] object-contain"
                      />
                    )}
                    {!data?.logoUrl && (
                      <Image
                        src={NoLogo}
                        width={40}
                        height={40}
                        alt="logo text"
                        className="mt-[-30px] md:mx-6 mx-3  border rounded-full bg-white md:w-[176px] md:h-[176px] w-[120px] h-[120px] object-contain"
                      />
                    )}
                  </button>
                </Tooltip>
                <Menu
                  sx={{ mt: "55px" }}
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
                    onClick={() => {
                      handleCloseUserMenu();
                      // router.push("/profile");
                    }}
                    className="flex flex-col items-cnter justify-center gap-y-3"
                  >
                    <Link href="/profile">
                      <button
                        className={`flex gap-2 items-center w-full ${
                          router.pathname === "/profile" ? "text-[#d5783f]" : ""
                        } hover:text-[#d5783f]`}
                      >
                        {/* <Avatar
                          
                          className={`h-[30px] w-[30px] text-slate-600 ${
                            router.pathname === "/profile"
                              ? "text-[#d5783f]"
                              : ""
                          }`}
                        /> */}
                        <AccountCircleIcon
                          className={`h-[30px] w-[30px] hover:text-[#d5783f] ${
                            router.pathname === "/profile"
                              ? "text-[#d5783f]"
                              : ""
                          }`}
                        />
                        My Profile
                      </button>
                    </Link>

                    {data?.isAdmin === true && (
                      <Link href="/dashboard/overview">
                        <button className="flex gap-2 items-center w-full hover:text-[#d5783f]">
                          <DashboardIcon className="h-[30px] w-[30px]" />
                          Dashboard
                        </button>
                      </Link>
                    )}
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      logout();
                    }}
                  >
                    <div className="flex gap-2 items-center justify-center">
                      <Logout fontSize="small" />
                      <button className="">Logout</button>
                    </div>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        {list("right")}
      </Drawer>
    </div>
  );
}

export default Navbar;
