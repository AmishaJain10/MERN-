import axios from "axios";

if (process.env.NODE_ENV === "production") {
  module.exports = axios.create({
    baseURL: process.env.MERN_BASE_URL
  });
} else {
  module.exports = axios.create({
    baseURL: "http://localhost:5000"
  });
}
