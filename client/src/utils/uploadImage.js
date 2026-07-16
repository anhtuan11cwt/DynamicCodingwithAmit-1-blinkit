import SummaryApi from "../common/SummaryApi";
import Axios from "./axios";

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await Axios({
    ...SummaryApi.uploadImage,
    data: formData,
  });

  return response.data;
};

export default uploadImage;
