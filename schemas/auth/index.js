import * as yup from "yup";
const URL =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
export const LoginSchema = yup.object().shape({
  userName: yup.string().required("This field is required"),
  password: yup.string().required("This field is required"),
});

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

export const EditProfileSchema = yup.object().shape(
  {
    userName: yup.string().required("Required"),
    firstName: yup.string().required("Required"),
    lastName: yup.string().required("Required"),
    email: yup.string().required("Required").email("Must be valid email"),
    phone: yup
      .string()
      .required("required")
      .matches(phoneRegExp, "Phone number is not valid"),

    companyName: yup.string().required("Required"),
    companyWebsite: yup
      .string()
      .notRequired()
      .when("companyWebsite", {
        is: (value) => value?.length,
        then: (rule) => rule.matches(URL, "Enter valid url"),
      }),
    companyType: yup.string().required("Required"),
    country: yup.string().required("Required"),
    city: yup.string().required("Required"),
    countryCode: yup.string().notRequired("Required"),
    postCode: yup
      .string()
      .matches(/^[aA-zZ0-9\s]+$/, "Enter valid PostCode ")
      .max(8)
      .required("Required"),
    address: yup.string().required("Required"),
  },
  [["companyWebsite", "companyWebsite"]]
);

export const UpdateInfoSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().required("Required").email("Must be valid email"),
  phone: yup
    .string()
    .required("required")
    .matches(phoneRegExp, "Phone number is not valid"),
  countryCode: yup.string().required("Required"),
  companyName: yup.string().required("Required"),
  companyWebsite: yup
      .string()
      .notRequired()
      .when("companyWebsite", {
        is: (value) => value?.length,
        then: (rule) => rule.matches(URL, "Enter valid url"),
      }),
  country: yup.string().required("Required"),
  city: yup.string().required("Required"),

  //password: yup.string().required('Required'),

  countryCode: yup.string().required("Required"),
  postCode: yup
    .string()
    .matches(/^[aA-zZ0-9\s]+$/, "Enter valid PostCode ")
    .max(8)
    .required("Required"),
  address: yup.string().required("Required"),
},
[["companyWebsite", "companyWebsite"]]
);


export const uploadFileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  file: yup
    .mixed()
    .required('PDF is required')
    .test('fileType', 'Unsupported File Format', (value) => {
      return value && value[0] && value[0].type === 'application/pdf';
    }),
});
