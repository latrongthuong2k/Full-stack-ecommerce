package com.ecommerce.myapp.s3;

import java.io.Serializable;

public record S3UserImages(
        
        String key,
        String url
) implements Serializable {
}
