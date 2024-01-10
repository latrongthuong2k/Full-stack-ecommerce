package com.ecommerce.myapp.s3;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

    @Value("${aws.region}")
    private String awsRegion;

    @Value("${aws.credentials.accessKeyId}")
    private String accessKeyId;

    @Value("${aws.credentials.secretKey}")
    private String secretKey;
//    @Value("${aws.s3.mock}")
//    private boolean mock;

    @Bean
    public S3Client s3Client() {
//        if (mock) {
//            return new FakeS3();
//        }
        return S3Client.builder()
                .region(Region.of(awsRegion))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKeyId, secretKey)))
                .build();
    }

}
