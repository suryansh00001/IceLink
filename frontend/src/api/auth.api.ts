import axiosInstance from "./axiosInstance";

export const updateAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axiosInstance.put("/users/update-avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
};
