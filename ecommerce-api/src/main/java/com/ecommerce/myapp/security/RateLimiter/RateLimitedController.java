package com.ecommerce.myapp.security.RateLimiter;


import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RateLimitedController {

    private final Bucket bucket;

    public RateLimitedController(Bucket bucket) {
        this.bucket = bucket;
    }

    // ví dụ
    @GetMapping("/limited-resource")
    public ResponseEntity<String> getLimitedResource() {
        // nạp 1 token mỗi lần req
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (probe.isConsumed()) {
            return ResponseEntity.ok("You have accessed a limited resource!");
        } else {
            // Too many requests
            double waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000.0; // đợi 1 p
            return ResponseEntity.status(429).body("Too many requests - please wait " + waitForRefill + " seconds");
        }
    }
}