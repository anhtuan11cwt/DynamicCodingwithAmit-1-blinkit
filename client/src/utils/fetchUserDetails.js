import SummaryApi from "../common/SummaryApi";
import Axios from "./axios";

const fetchUserDetails = async () => {
  try {
    const response = await Axios({ ...SummaryApi.userDetails });
    return response.data;
  } catch {
    return null;
  }
};

export default fetchUserDetails;
