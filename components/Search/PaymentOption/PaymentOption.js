import { Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { emailListRecoil } from "../../../store/atoms/emailListRecoil";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { checkoutRequestClient } from "../../../library/utils/queryClient";
import { priceRecoil } from "../../../store/atoms/priceRecoil";
import { serviceResquestResponseRecoilState } from "../../../store/atoms/serviceRequestResponseRecoil";
import { formStateRecoil } from "../../../store/atoms/formStateRecoil";

const serviceName = {
  MAIL_PRINT_SERVICE: "Mail & Print Service",
  DOWNLOAD_SERVICE: "Download Service",
  EMAIL_SERVICE: "Email Service",
};

const PaymentOption = (props) => {
  const defaultValues = {
    nameofcardholder: "",
    cardnumber: "",
    expiration: "",
    cvv: "",
  };

  const templateStrings = useRecoilValue(formStateRecoil);

  const email = useRecoilValue(emailListRecoil);
  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
  });

  const priceState = useRecoilValue(priceRecoil);
  const serviceRequest = useRecoilValue(serviceResquestResponseRecoilState);
  const priceValue = useRecoilValue(priceRecoil);

  const { isValid, dirtyFields, errors } = formState;
  const onSubmit = (values) => {};

  const [stripeToken, setStripeToken] = useState(null);
  // const history = useHistory();
  const router = useRouter();

  const handleBack = () => {
    if (templateStrings.letterKey == null) {
      router.push("/stepperpages/previewtemplate");
    } else {
      router.push("/stepperpages/companylistsender");
    }
  };

  // button handler function
  const onToken = (token) => {
    setStripeToken(token);
  };

  useEffect(() => {
    if (
      serviceRequest?.requestData?.package_name === "DOWNLOAD_SERVICE" ||
      serviceRequest?.requestData?.package_name === "EMAIL_SERVICE"
    ) {
      router.push("/stepperpages/paymentcomplete");
    } else if (serviceRequest?.response?.invoiceId) {
      router.push("/stepperpages/paymentcomplete");
    }
  }, [serviceRequest]);

  useEffect(() => {}, [props]);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        // const res = await userRequest.post("/checkout/payment", {
        //   tokenId: stripeToken.id,
        //   amount: 500,
        // });
        const payload = {
          service_request_id: "dummy",
          paid_amount: "5",
          token: stripeToken,
        };
        const response = await checkoutRequestClient(payload);

        // router.push("/paymentcomplete", {
        //   stripeData: res.data,
        //   products: "cart",
        // });
        // router.push("/stepperpages/paymentcomplete");
      } catch (e) {}
    };
    stripeToken && makeRequest();
  }, [stripeToken]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Payment method section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 my-5  justify-between ">
        {/*{false && (*/}
        {/*  <div className=" hidden text-left shadow-xl p-5 lg:p-8 md:p-8 xl:p-8">*/}
        {/*  <h2 className="headline3 text-[#202020ba] text-[17px]">*/}
        {/*    Please Select Your Payment Method*/}
        {/*  </h2>*/}
        {/*  <div className="flex py-3">*/}
        {/*    <span className="border p-2 rounded-xl  hover:border-orange-600 flex items-center md:p-5 lg:p-5 xl:p-5">*/}
        {/*      <Image src={Paypal} alt="payment method" className="" />*/}
        {/*    </span>*/}
        {/*    <span className="mx-2 border border-[#84818A]-600 p-2 rounded-xl hover:border-orange-600 flex items-center lg:mx-5 md:mx-5 xl:mx-5 md:p-5 lg:p-5 xl:p-5">*/}
        {/*      <Image src={MasterCard} alt="payment method" className="" />*/}
        {/*    </span>*/}
        {/*    <span className="border border-[#84818A]-600 p-2 rounded-xl hover:border-orange-600 flex items-center md:p-5 lg:p-5 xl:p-5">*/}
        {/*      <Image src={Visa} alt="payment method" className="" />*/}
        {/*    </span>*/}
        {/*    <div className="mx-2 border border-[#84818A]-600 p-2 rounded-xl flex items-center md:p-5 lg:p-5 xl:p-5 hover:border-orange-600 hover:text-orange-600 lg:mx-5 md:mx-5 xl:mx-5">*/}
        {/*      <span className="mr-2">*/}
        {/*        <AddIcon />*/}
        {/*      </span>*/}
        {/*      <button>Add Card</button>*/}
        {/*    </div>*/}
        {/*  </div>*/}

        {/*  <form*/}
        {/*    name="paymentmethoddetails"*/}
        {/*    noValidate*/}
        {/*    className="payment-option-form text left py-5"*/}
        {/*    autoComplete="off"*/}
        {/*    onSubmit={handleSubmit(onSubmit)}*/}
        {/*  >*/}
        {/*    <div className="grid gap-5 ">*/}
        {/*      /!*Cardholder Name*!/*/}
        {/*      <Controller*/}
        {/*        name="nameofcardholder"*/}
        {/*        control={control}*/}
        {/*        rules={{*/}
        {/*          required: true,*/}
        {/*          validate: value => {*/}
        {/*            if (value === "") {*/}
        {/*              return "please enter cardholder name";*/}
        {/*            }*/}
        {/*          },*/}
        {/*        }}*/}
        {/*        render={({ field }) => (*/}
        {/*          <TextField*/}
        {/*            {...field}*/}
        {/*            label="Name"*/}
        {/*            type="name"*/}
        {/*            className="bg-white rounded-2xl"*/}
        {/*            autofocus={true}*/}
        {/*            placeholder="Name"*/}
        {/*            error={!!errors.name}*/}
        {/*            helpertext={errors?.name?.message}*/}
        {/*            variant="outlined"*/}
        {/*            required*/}
        {/*            fullWidth*/}
        {/*          />*/}
        {/*        )}*/}
        {/*      />*/}
        {/*      /!*Card Number*!/*/}
        {/*      <Controller*/}
        {/*        name="cardnumber"*/}
        {/*        control={control}*/}
        {/*        rules={{*/}
        {/*          required: true,*/}
        {/*          validate: value => {*/}
        {/*            if (value === "") {*/}
        {/*              return "please enter card number";*/}
        {/*            }*/}
        {/*          },*/}
        {/*        }}*/}
        {/*        render={({ field }) => (*/}
        {/*          <TextField*/}
        {/*            {...field}*/}
        {/*            label="Card Number"*/}
        {/*            type="tel"*/}
        {/*            className="bg-white rounded"*/}
        {/*            autofocus={true}*/}
        {/*            placeholder="Card Number"*/}
        {/*            error={!!errors.cardnumber}*/}
        {/*            helpertext={errors?.cardnumber?.message}*/}
        {/*            variant="outlined"*/}
        {/*            required*/}
        {/*            fullWidth*/}
        {/*            InputProps={{*/}
        {/*              endAdornment: (*/}
        {/*                <InputAdornment position="end">*/}
        {/*                  <Image*/}
        {/*                    src={MasterCard}*/}
        {/*                    width="45"*/}
        {/*                    height="30"*/}
        {/*                    alt="cardimage"*/}
        {/*                  />*/}
        {/*                </InputAdornment>*/}
        {/*              ),*/}
        {/*            }}*/}
        {/*          />*/}
        {/*        )}*/}
        {/*      />*/}

        {/*      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">*/}
        {/*        /!*Expire Date*!/*/}
        {/*        <div className="grid grid-cols-1">*/}
        {/*          <Controller*/}
        {/*            name="expiration"*/}
        {/*            control={control}*/}
        {/*            rules={{*/}
        {/*              required: true,*/}
        {/*              validate: value => {*/}
        {/*                if (value === "") {*/}
        {/*                  return "please enter month year";*/}
        {/*                }*/}
        {/*              },*/}
        {/*            }}*/}
        {/*            render={({ field }) => (*/}
        {/*              <TextField*/}
        {/*                {...field}*/}
        {/*                label=""*/}
        {/*                type="date"*/}
        {/*                className="bg-white rounded"*/}
        {/*                autofocus={true}*/}
        {/*                placeholder="expiration"*/}
        {/*                error={!!errors.date}*/}
        {/*                helpertext={errors?.date?.message}*/}
        {/*                variant="outlined"*/}
        {/*                required*/}
        {/*                fullWidth*/}
        {/*              />*/}
        {/*            )}*/}
        {/*          />*/}
        {/*        </div>*/}
        {/*        /!*CVV*!/*/}
        {/*        <div className="grid grid-cols-1">*/}
        {/*          <Controller*/}
        {/*            name="cvv"*/}
        {/*            control={control}*/}
        {/*            rules={{*/}
        {/*              required: true,*/}
        {/*              validate: value => {*/}
        {/*                if (value === "") {*/}
        {/*                  return "please enter cvv";*/}
        {/*                }*/}
        {/*              },*/}
        {/*            }}*/}
        {/*            render={({ field }) => (*/}
        {/*              <TextField*/}
        {/*                {...field}*/}
        {/*                label="CVV"*/}
        {/*                type="number"*/}
        {/*                className="bg-white rounded"*/}
        {/*                autofocus={true}*/}
        {/*                placeholder="CVV"*/}
        {/*                error={!!errors.cvv}*/}
        {/*                helpertext={errors?.cvv?.message}*/}
        {/*                variant="outlined"*/}
        {/*                required*/}
        {/*                fullWidth*/}
        {/*              />*/}
        {/*            )}*/}
        {/*          />*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </form>*/}

        {/*  <StripeCheckout*/}
        {/*    name="Local New Business"*/}
        {/*    image="https://avatars.githubusercontent.com/u/1486366?v=4"*/}
        {/*    billingAddress*/}
        {/*    shippingAddress*/}
        {/*    description={`Your total is £5`}*/}
        {/*    amount={5 * 100}*/}
        {/*    token={onToken}*/}
        {/*    // stripeKey={'pk_test_51LzjiLKxA1nMm4Zk1XBA05wuv8Ugj5CNIvFET7shLNeGO3FPLl7m4Xplt8MOk0rr2qrV7HU2pjhU4ob4lzs7C23R00NxQjLJuq'}*/}
        {/*    stripeKey={props.props}*/}
        {/*    >*/}
        {/*    <button>CHECKOUT NOW</button>*/}
        {/*  </StripeCheckout>*/}
        {/*  */}
        {/*</div>*/}
        {/*)}*/}
        <div className="col-span-3 border-2 border-gray-50 shadow-lg">
          <button
            className="w-20 text-center p-2 bg-[#D16F32] text-white w-20 cursor-pointer rounded-md m-3"
            onClick={() => handleBack()}
          >
            Back
          </button>
          <img
            className="mx-auto"
            src="/assets/paymentComplete.png"
            alt="logoof network"
          />
        </div>
        <div className="col-span-2 md:col-span-2 shadow-lg px-8 pb-5 text-left">
          <h2 className="headline3 text-[#202020ba] text-[17px] mt-2">
            Your Order
          </h2>
          {/* <p className="headline9 text-[13px] text-[#20202082]  pt-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            integer convallis neque auctor nunc.
          </p> */}
          <div className="payment-option-details ">
            <div className="flex justify-between py-5">
              <p className="headline7 text-[15px] text-[#202020e5]">
                Service Provider
              </p>
              <p className="headline3 text-[15px] text-[#202020e5]">
                Local New Business
              </p>
            </div>
            <div className="flex justify-between py-2">
              <p className="headline7 text-[15px] text-[#202020e5]">
                Service Name
              </p>
              <p className="headline3 text-[15px] text-[#202020e5]">
                {serviceName[serviceRequest?.requestData?.package_name]}
              </p>
            </div>
            <div className="flex justify-between py-2">
              <p className="headline7 text-[16px] text-[#202020e5]">
                Total number of company
              </p>
              <p className="headline3 text-[16px] text-[#202020e5]">
                {serviceRequest?.requestData?.companyList?.length}
              </p>
            </div>
            <div className="flex justify-between py-2">
              <p className="headline7 text-[16px] text-[#202020e5]">Currency</p>
              <p className="headline3 text-[16px] text-[#202020e5]">GBP</p>
            </div>
            <Divider />
            <div className="pt-5  color-[#D9D9D9]"></div>
            <div className="flex justify-between py-2">
              <p className="headline7 text-[16px] text-[#202020e5]">
                Net Price
              </p>
              <p className="headline3 text-[16px] text-[#202020e5]">
                £ {priceValue[serviceRequest?.requestData?.package_name]} *{" "}
                {serviceRequest?.requestData?.companyList?.length}
              </p>
            </div>
            <div className="flex justify-between py-2">
              <p className="headline7 text-[16px] text-[#202020e5]">VAT</p>
              <p className="headline3 text-[16px] text-[#202020e5]">£ 0</p>
            </div>
            <Divider />
            <div className="pt-5  color-[#D9D9D9]"></div>
            <div className="flex justify-between pt-3">
              <p className="headline2 text-[20px] text-[#202020d6]">
                Total Price
              </p>
              <p className="headline2 text-[20px] text-[#202020d6]">
                £{" "}
                {priceValue[serviceRequest?.requestData?.package_name] *
                  serviceRequest?.requestData?.companyList?.length}
              </p>
            </div>
            {/* <div className="py-4 bg-transparent">
              <div className="flex justify-between p-4  rounded-lg bg-[#f0f8ff]">
                <p className="headline5 text-[#3294D1]">
                  Your total saving in this order
                </p>
                <p className="headline5 text-[#3294D1]">£1.50</p>
              </div>
            </div> */}

            {/* Coupon code InPut Field */}

            {/* <div className="flex justify-between pt-10">
              <div className="payment-option-coupun-code">
                <Controller
                  name="Coupon Code"
                  control={control}
                  rules={{
                    required: true,
                    validate: value => {
                      if (value === "") {
                        return "please enter Coupon Code";
                      }
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Coupon Code"
                      type="tel"
                      className="bg-white rounded"
                      autofocus={true}
                      placeholder="Coupon Code"
                      error={!!errors.cvv}
                      helpertext={errors?.cvv?.message}
                      variant="outlined"
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PercentIcon></PercentIcon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </div>

              <button
                type="submit"
                className="rounded-lg  border-2 border-[#D16F32] text-[#D16F32] cursor-pointer py-3 ml-1 sm:mx-0 md:ml-1 lg:ml-1 xl:mx-0 px-6 "
              >
                Apply
              </button>


            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOption;
