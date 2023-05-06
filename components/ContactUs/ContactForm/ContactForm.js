import React from "react";
import {InputLabel, TextField} from "@mui/material";

import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {contactSchema} from "../../auth/utils/helper";
import {useSnackbar} from "notistack";
import axios from "axios";

const ContactForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const defaultValues = {
    email: "",
    fullName: "",
    companyName: "",
    subject: "",
    message: "",
  };

  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(contactSchema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = async (values) => {
    const data = {
      name: values.fullName,
      email: values.email,
      companyName: values.companyName,
      subject: values.subject,
      message: values.message,
    };
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/email/contact`,
        data
      );
      if (response.status === 200) {
        enqueueSnackbar(response.data.message, { variant: "success" });
        reset();
      }
    } catch (err) {
      if (err.response) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      }
      console.log(err);
    }
  };
  return (
    <div className="my-20  max-w-7xl mx-auto">
      <form
        name="contractForm"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col px-5 py-10 justify-center items-center"
      >
        <div className=" flex flex-col gap-5 items-center justify-between lg:w-3/4 md:w-3/4">
          <div className="grid grid-cols-2 gap-5 w-full">
            <div>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="headline7 text-[16px]">
                      Full Name *
                    </InputLabel>
                    <TextField
                      {...field}
                      type="text"
                      className="bg-white rounded mt-2"
                      autoFocus={true}
                      placeholder="Input your full name"
                      error={!!errors.fullName}
                      helperText={errors?.fullName?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </>
                )}
              />
            </div>

            <div>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="headline7 text-[16px]">
                      Company Name *
                    </InputLabel>
                    <TextField
                      {...field}
                      type="text"
                      className="bg-white rounded mt-2"
                      autoFocus={true}
                      placeholder="Input your company name"
                      error={!!errors.companyName}
                      helperText={errors?.companyName?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 w-full">
            <div>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: true,
                  validate: (value) => {
                    if (value === "") {
                      return "Please provide input name";
                    }
                  },
                }}
                render={({ field }) => (
                  <>
                    <InputLabel className="headline7 text-[16px]">
                      Email Address *
                    </InputLabel>
                    <TextField
                      {...field}
                      type="email"
                      className="bg-white rounded mt-2"
                      autoFocus={true}
                      placeholder="Input your email address"
                      error={!!errors.email}
                      helperText={errors?.email?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </>
                )}
              />
            </div>

            <div>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel className="headline7 text-[16px]">
                      Subject *
                    </InputLabel>
                    <TextField
                      {...field}
                      type="text"
                      className="bg-white rounded mt-2"
                      autoFocus={true}
                      placeholder="Enter your subject"
                      error={!!errors.subject}
                      helperText={errors?.subject?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </>
                )}
              />
            </div>
          </div>
          <div className="w-full">
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Messages"
                  type="text"
                  multiline={true}
                  rows={5}
                  className="bg-white"
                  autoFocus={true}
                  placeholder="Write your messages here"
                  helperText={errors?.message?.message}
                  variant="outlined"
                  error={!!errors?.message}
                  required
                  fullWidth
                />
              )}
            />
          </div>
        </div>

        <button
          type="submit"
          className="text-white hover:bg-primaryHover cursor-pointer my-5 capitalize p-4 w-full md:w-96 rounded-md font-bold shadow-none hover:shadow-none bg-primary"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
