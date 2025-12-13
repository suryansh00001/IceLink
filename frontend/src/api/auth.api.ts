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

export const updateDetails = async (username?: string, email?: string) => {
    const response = await axiosInstance.put("/users/update-details", { username, email });
    return response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
    const response = await axiosInstance.put("/users/change-password", { currentPassword, newPassword });
    return response.data;
};
