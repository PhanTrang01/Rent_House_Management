const axios = require("axios");

const username = "trang";
const password = "12345678";

const register = async () => {
  try {
    const res = await axios.post("http://localhost:3000/api/register", {
      username,
      password,
    });
    console.log("Response: " + JSON.stringify(res.data));
  } catch (error) {
    console.error(error?.response?.data?.message);
  }
};

(async function () {
  await register();
})();
