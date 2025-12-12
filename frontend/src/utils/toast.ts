type ToastType = "success" | "error" | "info" | "warning";

export const showToast = (message: string, type: ToastType = "info") => {
    // For now, use alert as a simple toast implementation
    // You can integrate a proper toast library later like react-toastify
    const prefix = {
        success: "✅ ",
        error: "❌ ",
        info: "ℹ️ ",
        warning: "⚠️ "
    };
    
    alert(prefix[type] + message);
};
