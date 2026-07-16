import SummaryApi from "../common/SummaryApi";
import Axios from "./axios";

const uploadImage = async (file, type) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await Axios({
    ...SummaryApi.uploadImage,
    data: formData,
    url: type
      ? `${SummaryApi.uploadImage.url}/${type}`
      : SummaryApi.uploadImage.url,
  });

  return response.data;
};

export default uploadImage;
