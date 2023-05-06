import React, { useEffect, useState } from "react";
import Dashboard from "../../Dashboard/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TotalRevenue from "./TotalRevenue";
import ProductSale from "./ProductSale";
import apiClient from "../../../library/apis/api-client";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ElectricalServicesOutlinedIcon from "@mui/icons-material/ElectricalServicesOutlined";
import RevenuePerMonth from "./RevenuePerMonth";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MenuItem, Select, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import TopCitiesByCompany from "./TopCitiesByCompany";
import UsersByMonth from "./UsersByMonth";
import RevenuePerYear from "./RevenuePerYear";

const Overview = () => {
  const [data, setData] = useState(null);
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [totalService, setTotalService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateUser, setSelectedDateUser] = useState(new Date());
  const [selectedDateCompany, setSelectedDateCompany] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedYearUser, setSelectedYearUser] = useState(
    new Date().getFullYear()
  );

  const [selectedYearNewCompany, setSelectedYearNewCompany] = useState(
    new Date().getFullYear()
  );
  const [totalRev, setTotalRev] = useState([]);

  const [revMonth, setRevMonth] = useState();
  const [revenue, setRevenue] = useState();
  const [paymentMade, setPaymentMade] = useState();

  const [revYear, setRevYear] = useState();
  const [revAmount, setRevAmount] = useState();
  const [paymentMadeYear, setPaymentMadeYear] = useState();

  const [usersMonth, setUsersMonth] = useState();
  const [usersNumber, setUsersNumber] = useState();

  const [newCompanyMonth, setNewCompanyMonth] = useState();
  const [newCompanyValue, setNewCompanyValue] = useState();

  const [cityName, setCityName] = useState();
  const [companyNumber, setCompanyNumber] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const [revenueType, setRevenueType] = React.useState("month");

  const handleChange = (event) => {
    setRevenueType(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    // Convert the selected date string to a Date object
    const selectedDateObj = new Date(date);

    // Get the year from the selected date object
    const year = selectedDateObj.getFullYear();
    setSelectedYear(year);
  };

  const handleDateChangeUser = (date) => {
    setSelectedDateUser(date);

    // Convert the selected date string to a Date object
    const selectedDateObj = new Date(date);

    // Get the year from the selected date object
    const year = selectedDateObj.getFullYear();
    setSelectedYearUser(year);
  };

  const handleDateChangeCompany = (date) => {
    setSelectedDateCompany(date);

    // Convert the selected date string to a Date object
    const selectedDateObj = new Date(date);

    // Get the year from the selected date object
    const year = selectedDateObj.getFullYear();
    setSelectedYearNewCompany(year);
  };

  const getOverviewData = async () => {
    const res = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/getDataOverview`
    );
    if (res.status === 200) {
      setData(res?.data);
      setSeries(Object.values(res?.data?.ServiceUsage));
      const label = Object.keys(res?.data?.ServiceUsage);
      const newLabels = label.map((e) => {
        if (e === "DOWNLOAD_SERVICE") {
          return "Download";
        }
        if (e === "EMAIL_SERVICE") {
          return "Email";
        } else {
          return "Print and  Post";
        }
      });
      setLabels(newLabels);
    }
  };
  useEffect(() => {
    getOverviewData().then((r) => r);
  }, []);

  useEffect(() => {
    setTotalService(series.reduce((c, a) => c + a, 0));
  }, [series]);

  const getRevenueData = async () => {
    const res = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/history/totalRevenue`
    );
    if (res.status === 200) {
      setTotalRev([res.data?.totalPaid]);
      setTotalRev((e) => [...e, res.data?.totalUnPaid]);
    }
  };
  useEffect(() => {
    getRevenueData().then((r) => r);
  }, []);

  const getMonthlyRevenueData = async (year) => {
    const res = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/history/per-month-revenue?year=${year}`
    );
    if (res.status === 200) {
      const sortedData = res.data.monthlyRevenueArray.sort((a, b) => {
        return a._id - b._id;
      });
      const [months, values, paymentMade] = sortedData.reduce(
        (
          [months, values, paymentMade],
          { monthName, revenue_amount, number_of_payments }
        ) => {
          months.push(monthName);
          values.push(Math.floor(revenue_amount));
          paymentMade.push(Math.floor(number_of_payments));
          return [months, values, paymentMade];
        },
        [[], [], []]
      );
      setRevMonth(months);
      setRevenue(values);
      setPaymentMade(paymentMade);
    } else {
      enqueueSnackbar("No Future Year", { variant: "error" });
    }
  };
  useEffect(() => {
    getMonthlyRevenueData(selectedYear).then((r) => r);
  }, [selectedYear]);

  const getYearlyRevenueData = async () => {
    const res = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/history/per-year-revenue`
    );
    if (res.status === 200) {
      const sortedData = res.data.yearlyRevenueArray.sort((a, b) => {
        return a._id - b._id;
      });
      const [months, values, paymentMade] = sortedData.reduce(
        (
          [months, values, paymentMade],
          { yearNum, revenue_amount, number_of_payments }
        ) => {
          months.push(yearNum);
          values.push(Math.floor(revenue_amount));
          paymentMade.push(Math.floor(number_of_payments));
          return [months, values, paymentMade];
        },
        [[], [], []]
      );
      setRevYear(months);
      setRevAmount(values);
      setPaymentMadeYear(paymentMade);
    }
  };
  useEffect(() => {
    getYearlyRevenueData().then((r) => r);
  }, [revenueType]);

  const getUsersByMonth = async (year) => {
    const res = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/stats/per-month-registry?year=${year}`
    );
    if (res.status === 200) {
      const sortedData = res.data.monthlyNewUserArray.sort((a, b) => {
        return a._id - b._id;
      });
      const [months, values] = sortedData.reduce(
        ([months, values], { monthName, newUsersNum }) => {
          months.push(monthName);
          values.push(newUsersNum);
          return [months, values];
        },
        [[], []]
      );
      setUsersMonth(months);
      setUsersNumber(values);
    } else {
      enqueueSnackbar("No Future Year", { variant: "error" });
    }
  };
  useEffect(() => {
    getUsersByMonth(selectedYearUser).then((r) => r);
  }, [selectedYearUser]);

  const getNewCompanyByMonth = async (year) => {
    const res = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/company//stats/per-month-companies?year=${year}`
    );
    if (res.status === 200) {
      const sortedData = res.data.monthlyCompaniesArray.sort((a, b) => {
        return a._id - b._id;
      });
      const [months, values] = sortedData.reduce(
        ([months, values], { monthName, number_of_companies }) => {
          months.push(monthName);
          values.push(number_of_companies);
          return [months, values];
        },
        [[], []]
      );
      setNewCompanyMonth(months);
      setNewCompanyValue(values);
    } else {
      enqueueSnackbar("No Future Year", { variant: "error" });
    }
  };
  useEffect(() => {
    getNewCompanyByMonth(selectedYearNewCompany).then((r) => r);
  }, [selectedYearNewCompany]);

  const getHeightCompanyByCity = async (year) => {
    const res = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/stats/city-wise-company-number`
    );
    if (res.status === 200) {
      const sortedData = res.data.cityWiseCompanyNumber.sort((a, b) => {
        return b.number_of_companies - a.number_of_companies;
      });

      const [cityName, companyNumber] = sortedData.reduce(
        ([cityName, companyNumber], { city_name, number_of_companies }) => {
          cityName.push(city_name);
          companyNumber.push(number_of_companies);
          return [cityName, companyNumber];
        },
        [[], []]
      );
      setCityName(cityName);
      setCompanyNumber(companyNumber);
    } else {
      enqueueSnackbar("NETWORK ERROR", { variant: "error" });
    }
  };
  useEffect(() => {
    getHeightCompanyByCity(selectedYear).then((r) => r);
  }, []);

  return (
    <Dashboard>
      {!!data && (
        <div className="xl:max-w-[1400px]  p-1 bg-slate-100 w-full md: pt-10 lg:p-10 md:p-10 xl:p-10 2xl:p-10 h-auto">
          <div className="flex justify-between">
            <h2 className="text-2xl mt-5 font-semibold">Overview</h2>
            {/*<form onSubmit={handleSubmit}>*/}
            {/*  <input*/}
            {/*      placeholder="Type into search"*/}
            {/*      className="border-2 border-solid p-1 rounded outline-none"*/}
            {/*  />*/}
            {/*</form>*/}
          </div>

          <div className="flex flex-col py-10 md:flex-row lg:flex-row xl:flex-row md:justify-between lg:justify-between xl:justify-between">
            <div className="flex bg-white p-3 w-full rounded-lg my-1 justify-between  md:mr-3 lg:mr-3 xl:mr-3 2xl:mr-3 xl:max-w-1/3  md:w-1/3 2xl:w-1/3 relative">
              <div>
                <h3 className="font-semibold  py-1 text-[13px] xl:text-[15px]">
                  Number of Users
                </h3>
                <p className="text-[#3294D1] text-[25px]  font-semibold">
                  {data?.noOfUsers}
                </p>
                <span className="text-[11px] font-semibold text-gray-500">
                  Til today
                </span>
              </div>
              <div className="flex items-end">
                <span className="bg-blue-200 rounded-2xl p-1">
                  <PeopleAltIcon />
                </span>
              </div>
            </div>
            <div></div>

            <div className="flex bg-white p-3 w-full rounded-lg my-1 justify-between  md:mx-3  lg:mx-3  xl:mx-3  2xl:mx-3 xl:max-w-1/3  md:w-1/3 2xl:w-1/3">
              <div>
                <h3 className="font-semibold py-1 text-[13px] xl:text-[15px]">
                  Total Companies
                </h3>
                <p className="text-[#1C9929] text-[25px]  font-semibold">
                  {data?.noOfCompanies}
                </p>
                <span className="text-[11px] font-semibold text-gray-500">
                  Til today
                </span>
              </div>
              <div className="flex items-end">
                <span className="bg-green-200 rounded-2xl p-1">
                  <BusinessOutlinedIcon />
                </span>
              </div>
            </div>

            <div className="flex bg-white p-3 w-full my-1 rounded-lg justify-between md:ml-3 lg:ml-3 xl:ml-3 2xl:ml-3 xl:max-w-1/3  md:w-1/3 2xl:w-1/3">
              <div>
                <h3 className="font-semibold py-1 text-[13px] xl:text-[15px]">
                  Number of Total Service
                </h3>
                <p className="text-[#D16F32] text-[25px]  font-semibold">
                  {totalService}
                </p>
                <span className="text-[11px] font-semibold text-gray-500">
                  Til today
                </span>
              </div>
              <div className="flex items-end">
                <span className="bg-amber-200 rounded-2xl p-1">
                  <ElectricalServicesOutlinedIcon />
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="col-span-1 md:col-span-2 rounded-lg flex flex-col justify-between p-3 m-1  bg-white">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">
                  Revenue Per {revenueType === "month" ? "Month" : "Year"}
                </h3>
                <div className="flex gap-5">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={revenueType}
                    size={"small"}
                    label={"Type"}
                    onChange={handleChange}
                  >
                    <MenuItem value={"month"}>Monthly</MenuItem>
                    <MenuItem value={"year"}>Yearly</MenuItem>
                  </Select>
                  {revenueType === "month" && (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label={"Select Year"}
                        views={["year"]}
                        className="mt-2 mr-2"
                        openTo={"year"}
                        value={selectedDate}
                        format="yyyy-MM-dd"
                        disableFuture={true}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            variant="outlined"
                            style={{ width: 150, paddingRight: 0 }}
                            error={false}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                </div>
              </div>
              {revenueType === "month" && (
                <div>
                  {!!revenue && !!revMonth && paymentMade && (
                    <RevenuePerMonth
                      values={revenue}
                      months={revMonth}
                      paymentMade={paymentMade}
                    />
                  )}
                </div>
              )}
              {revenueType === "year" && (
                <div>
                  {!!revYear && !!revAmount && paymentMadeYear && (
                    <RevenuePerYear
                      values={revAmount}
                      months={revYear}
                      paymentMade={paymentMadeYear}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-5 col-span-1">
              <div className="rounded-lg  bg-white p-3 m-1 relative">
                <h3 className="font-semibold">Total Revenue</h3>
                <div className="pt-5">
                  {!!totalRev && <TotalRevenue revData={totalRev} />}
                  {!totalRev && <div>Loading ...</div>}
                </div>
              </div>
              <div className="rounded-lg bg-white p-3 m-1 relative">
                <h3 className="font-semibold">Product Sold</h3>
                <div className="pt-5">
                  {!!series && labels && (
                    <ProductSale seriesData={series} labels={labels} />
                  )}
                  {!series && labels && <div>Loading...</div>}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-10">
            <div className="col-span-1 rounded-lg flex flex-col justify-between p-3 m-1  bg-white">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Top Cities by Company</h3>
              </div>
              {!!companyNumber && !!cityName && (
                <TopCitiesByCompany
                  companyNumber={companyNumber}
                  cityName={cityName}
                  type={"bar"}
                  title={"Top Cities by Company"}
                />
              )}
            </div>
            <div className="col-span-1 rounded-lg flex flex-col justify-between p-3 m-1  bg-white">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">New User by Month </h3>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={"Select Year"}
                    views={["year"]}
                    className="mt-2 mr-2"
                    openTo={"year"}
                    value={selectedDateUser}
                    format="yyyy-MM-dd"
                    disableFuture={true}
                    onChange={handleDateChangeUser}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        style={{ width: 150, paddingRight: 0 }}
                        error={false}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
              {!!usersMonth && !!usersNumber && (
                <UsersByMonth
                  userNumber={usersNumber}
                  userMonth={usersMonth}
                  type={"bar"}
                  title={"New User by Month "}
                />
              )}
            </div>

            <div className="col-span-full rounded-lg flex flex-col justify-between p-3 m-1  bg-white">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">New Company by Month </h3>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={"Select Year"}
                    views={["year"]}
                    className="mt-2 mr-2"
                    openTo={"year"}
                    value={selectedDateCompany}
                    format="yyyy-MM-dd"
                    disableFuture={true}
                    onChange={handleDateChangeCompany}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        style={{ width: 150, paddingRight: 0 }}
                        error={false}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
              {!!newCompanyMonth && !!newCompanyValue && (
                <UsersByMonth
                  userNumber={newCompanyValue}
                  userMonth={newCompanyMonth}
                  type={"bar"}
                  title={"New Company by Month "}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {!data && <div>Loading..</div>}
    </Dashboard>
  );
};

export default Overview;
