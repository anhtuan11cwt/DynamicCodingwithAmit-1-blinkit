import addressModel from "../models/address.model.js";
import userModel from "../models/user.model.js";
import {
  createAddressSchema,
  updateAddressSchema,
} from "../validations/address.validation.js";

export const addAddress = async (req, res) => {
  try {
    const parsed = createAddressSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const { address_line, city, state, pincode, mobile } = parsed.data;
    const userId = req.userId;

    const address = await addressModel.create({
      address_line,
      city,
      mobile,
      pincode,
      state,
      user_id: userId,
    });

    await userModel.findByIdAndUpdate(userId, {
      $push: { address_details: address._id },
    });

    res.status(201).json({
      data: address,
      message: "Địa chỉ đã được thêm",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Đã xảy ra lỗi",
      success: false,
    });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;

    const addressList = await addressModel.find({
      status: true,
      user_id: userId,
    });

    res.status(200).json({
      data: addressList,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Đã xảy ra lỗi",
      success: false,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const parsed = updateAddressSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const { address_line, city, state, pincode, mobile } = parsed.data;
    const userId = req.userId;

    const address = await addressModel.findOne({ _id: id, user_id: userId });

    if (!address) {
      return res.status(404).json({
        error: true,
        message: "Địa chỉ không tồn tại",
        success: false,
      });
    }

    address.address_line = address_line ?? address.address_line;
    address.city = city ?? address.city;
    address.state = state ?? address.state;
    address.pincode = pincode ?? address.pincode;
    address.mobile = mobile ?? address.mobile;

    await address.save();

    res.status(200).json({
      data: address,
      message: "Địa chỉ đã được cập nhật",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Đã xảy ra lỗi",
      success: false,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const address = await addressModel.findOne({ _id: id, user_id: userId });

    if (!address) {
      return res.status(404).json({
        error: true,
        message: "Địa chỉ không tồn tại",
        success: false,
      });
    }

    address.status = false;
    await address.save();

    res.status(200).json({
      message: "Địa chỉ đã được xóa",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Đã xảy ra lỗi",
      success: false,
    });
  }
};
