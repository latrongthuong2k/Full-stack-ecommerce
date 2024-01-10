package com.ecommerce.myapp.s3;

import java.io.Serializable;

public record S3ProductImages(
        
        String key,
        String url
) implements Serializable {
}
