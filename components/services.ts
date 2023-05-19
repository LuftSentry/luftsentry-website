import axios from "axios";

const getLastResults = async () => {
  const response = await axios.get("https://api.luftsentry.com/v1/records");
  console.log(response.data);
  return response.data;
};

const getUsers = async () => {
  const response = await axios.get("https://api.luftsentry.com/v1/user?id=1");
  console.log(response.data);
  return response.data;
};

const getDevices = async () => {
  const response = await axios.get("https://api.luftsentry.com/v1/device?id=1");
  console.log(response.data);
  return response.data;
}

export { getLastResults, getUsers, getDevices };
