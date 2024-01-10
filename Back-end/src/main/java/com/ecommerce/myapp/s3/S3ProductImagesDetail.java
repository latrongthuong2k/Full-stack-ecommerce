package com.ecommerce.myapp.s3;

import java.io.Serializable;

public record S3ProductImagesDetail(
        
        String key,
        String url,
        Boolean isPrimary
) implements Serializable {
}
