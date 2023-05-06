import apiClient from "../../../library/apis/api-client";

const getPrice = async () => {
  try {
    const res = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/retrievePrices`
    );

    if (res.status === 200) {
      return res;
    }
  } catch (e) {
    console.log(e);
  }
};

const updatePrice = async (datatype, value) => {
  try {
    if (datatype === "DOWNLOAD_SERVICE") {
      const res = await apiClient.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/updatePrices`,
        {
          DOWNLOAD_SERVICE: value,
        }
      );
    } else if (datatype === "EMAIL_SERVICE") {
      const res = await apiClient.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/updatePrices`,
        {
          EMAIL_SERVICE: value,
        }
      );
    } else {
      const res = await apiClient.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/updatePrices`,
        {
          MAIL_PRINT_SERVICE: value,
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
};

const getRetriveKeys = async () => {
  try {
    const res = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/retrieveStripeKeys`
    );

    if (res.status === 200) {
      return res;
    }
  } catch (e) {
    console.log(e);
  }
};

const updateStripeKeys = async (type, value) => {
  try {
    if (type === "PK") {
      const res = await apiClient.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/updateStripeKey`,
        {
          stripe_pk: value,
        }
      );
    } else {
      const res = await apiClient.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings/updateStripeKey`,
        {
          stripe_sk: value,
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
};

export { getPrice, updatePrice, getRetriveKeys, updateStripeKeys };
