import * as yup from "yup";

const URL =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

// Login form validatin schema
export const loginSchema = yup.object().shape({
  usernameOremail: yup
    .string()
    .required("UserName or Email is required")
    .test(
      "is-email-or-username",
      "Invalid Email or UserName",
      function (value) {
        return (
          value &&
          (yup.string().email().isValidSync(value) ||
            /^[a-zA-Z0-9_]{1,15}$/.test(value))
        );
      }
    ),

  password: yup.string().required("No password provided."),
});

export const printAndPostSchema = yup.object().shape({
  subject: yup.string().required("Subject is required"),
  // body: yup.string().required("Subject is required"),
});
export const uploadTemplateSchema = yup.object().shape({
  templateName: yup.string().required("Enter Template Name"),
  templateFile: yup.string().required("Select File"),
});
export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required("Enter your previous password "),
  newPassword: yup
    .string()
    .required("Password is required.")
    .min(8, "Password is too short - should be 8 chars minimum."),
});
export const resetPassSchema = yup.object().shape({
  email: yup
    .string()
    .email("Must be an Email")
    .required("You must enter Email"),
});

// registration form validation schema

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

export const regiSchema = yup.object().shape(
  {
    firstname: yup.string().required("First name is required"),
    lastname: yup.string().required("Last name is required"),
    email: yup.string().email("Must be email").required("Email is required"),
    phoneNumber: yup
      .string()
      .required("required")
      .matches(phoneRegExp, "Phone number is not valid"),

    country: yup.string().required("Country is required"),
    countryCode: yup.string().required("Required"),
    city: yup.string().required("State/City is required"),
    zip: yup
      .string()
      .matches(/^[aA-zZ0-9\s]+$/, "Enter valid PostCode ")
      .max(8)
      .required("Required"),
    address: yup.string().required("Address is required"),
    userName: yup.string().required("User Name is required"),
    companyWebsite: yup
      .string()
      .notRequired()
      .when("companyWebsite", {
        is: (value) => value?.length,
        then: (rule) => rule.matches(URL, "Enter valid url"),
      }),

    companyName: yup.string().required("Company Name is required"),
    companyType: yup.string().required("Company Type is required"),
    password: yup
      .string()
      .required("Password is required.")
      .min(8, "Password is too short - should be 8 chars minimum."),
  },
  [
    // Add Cyclic deps here because when require itself
    ["companyWebsite", "companyWebsite"],
  ]
);

// Contact form validation schema
export const contactSchema = yup.object().shape({
  fullName: yup.string().required("Enter your full name"),
  companyName: yup.string().required("Enter your company name"),
  email: yup
    .string()
    .email("Enter a valid Email")
    .required("Email is required"),
  subject: yup.string().required("Please enter subject"),
  message: yup.string().required("Please enter your message"),
});

// Reset password validation schema
export const resetpassschema = yup.object().shape({
  password: yup
    .string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

// Search Modal validation schema

export const searchmodalschema = yup.object().shape(
  {
    incorporated_from: yup.string(),

    // yup.lazy(() =>
    //   yup
    //     .string()
    //     .when(
    //       [
    //         "incorporated_to",
    //         "company_name",
    //         "sic_codes",
    //         "postal_code",
    //         "city",
    //       ],
    //       {
    //         is: (incorporated_to, company_name, sic_codes, postal_code, city) =>
    //           !incorporated_to &&
    //           !company_name &&
    //           !sic_codes &&
    //           !postal_code &&
    //           !city,
    //         then: yup.string().required(),
    //       }
    //     )
    // ),
    incorporated_to: yup.string(),

    // yup.lazy(() =>
    //   yup
    //     .string()
    //     .when(
    //       [
    //         "incorporated_from",
    //         "company_name",
    //         "sic_codes",
    //         "postal_code",
    //         "city",
    //       ],
    //       {
    //         is: (
    //           incorporated_from,
    //           company_name,
    //           sic_codes,
    //           postal_code,
    //           city
    //         ) =>
    //           !incorporated_from &&
    //           !company_name &&
    //           !sic_codes &&
    //           !postal_code &&
    //           !city,
    //         then: yup.string().required(),
    //       }
    //     )
    // ),
    city: yup.string(),

    // yup.lazy(() =>
    //   yup
    //     .string()
    //     .when(
    //       [
    //         "incorporated_to",
    //         "company_name",
    //         "sic_codes",
    //         "postal_code",
    //         "incorporated_from",
    //       ],
    //       {
    //         is: (
    //           incorporated_from,
    //           company_name,
    //           sic_codes,
    //           postal_code,
    //           incorporated_to
    //         ) =>
    //           !incorporated_from &&
    //           !company_name &&
    //           !sic_codes &&
    //           !postal_code &&
    //           !incorporated_to,
    //         then: yup.string().required(),
    //       }
    //     )
    // ),
    company_name: yup.string(),
    // yup.lazy(() =>
    //   yup
    //     .string()
    //     .when(
    //       [
    //         "incorporated_to",
    //         "city",
    //         "sic_codes",
    //         "postal_code",
    //         "incorporated_from",
    //       ],
    //       {
    //         is: (
    //           incorporated_from,
    //           city,
    //           sic_codes,
    //           postal_code,
    //           incorporated_to
    //         ) =>
    //           !incorporated_from &&
    //           !city &&
    //           !sic_codes &&
    //           !postal_code &&
    //           !incorporated_to,
    //         then: yup.string().required(),
    //       }
    //     )
    // ),
    sic_codes: yup.string(),

    // yup.lazy(() =>
    //   yup
    //     .string()
    //     .when(
    //       [
    //         "incorporated_to",
    //         "company_name",
    //         "city",
    //         "postal_code",
    //         "incorporated_from",
    //       ],
    //       {
    //         is: (
    //           incorporated_from,
    //           company_name,
    //           city,
    //           postal_code,
    //           incorporated_to
    //         ) =>
    //           !incorporated_from &&
    //           !company_name &&
    //           !city &&
    //           !postal_code &&
    //           !incorporated_to,
    //         then: yup.string().required(),
    //       }
    //     )
    // ),
    postal_code: yup.string(),

    // yup.lazy(() =>
    //   yup
    //     .string()
    //     .when(
    //       [
    //         "incorporated_to",
    //         "company_name",
    //         "city",
    //         "sic_codes",
    //         "incorporated_from",
    //       ],
    //       {
    //         is: (
    //           incorporated_from,
    //           company_name,
    //           city,
    //           sic_codes,
    //           incorporated_to
    //         ) =>
    //           !incorporated_from &&
    //           !company_name &&
    //           !city &&
    //           !sic_codes &&
    //           !incorporated_to,
    //         then: yup.string().matches(new RegExp("[0-9]")).required(),
    //       }
    //     )
    // ),
  }
  // [
  //   ["incorporated_from", "company_name", "sic_codes", "postal_code", "city"],
  //   ["incorporated_to", "company_name", "sic_codes", "postal_code", "city"],
  //   [
  //     "incorporated_to",
  //     "company_name",
  //     "sic_codes",
  //     "postal_code",
  //     "incorporated_from",
  //   ],
  //   [
  //     "incorporated_to",
  //     "city",
  //     "sic_codes",
  //     "postal_code",
  //     "incorporated_from",
  //   ],
  //   [
  //     "incorporated_to",
  //     "company_name",
  //     "city",
  //     "postal_code",
  //     "incorporated_from",
  //   ],
  //   [
  //     "incorporated_to",
  //     "company_name",
  //     "city",
  //     "sic_codes",
  //     "incorporated_from",
  //   ],
  // ]
);

// company result search validation

export const resultSearchValidation = yup.object().shape({
  post_code: yup.string().required(),
  sic_code: yup.string().required(),
});
