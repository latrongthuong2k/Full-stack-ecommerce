package com.ecommerce.myapp.model.checkoutGroup;

public enum OrderStatusV2 {
    WAITING,
    CONFIRM,
    DELIVERY,
    SUCCESS,
    CANCEL,
    DENIED;

    // Phương thức tĩnh để chuyển đổi từ chuỗi
    public static OrderStatusV2 fromString(String statusString) {
        if (statusString != null && !statusString.isEmpty()) {
            try {
                return OrderStatusV2.valueOf(statusString.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Not correct value of order status");
            }
        }
        return null;
    }
}
