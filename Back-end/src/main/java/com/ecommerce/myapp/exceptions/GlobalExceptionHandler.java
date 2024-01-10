package com.ecommerce.myapp.exceptions;

import io.jsonwebtoken.JwtException;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import javax.security.sasl.AuthenticationException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Nơi bắt tất cả các lỗi throw ra
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    // Exception for @valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidErrorRes> handleValidationExceptions(MethodArgumentNotValidException ex,
                                                                    WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        ValidErrorRes validErrorRes = new ValidErrorRes(HttpStatus.BAD_REQUEST.value(),
                errors,
                request.getDescription(false),
                LocalDateTime.now());
        return ResponseEntity.badRequest().body(validErrorRes);
    }


//    @ExceptionHandler({IllegalAccessException.class,
//            IllegalArgumentException.class})
//    public ResponseEntity<ApiError> handleForbiddenExceptions(Exception ex, WebRequest request) {
//        return buildResponseEntity(HttpStatus.FORBIDDEN, ex, request);
//    }

    @ExceptionHandler({IllegalAccessException.class, CannotDeleteException.class, MissingServletRequestParameterException.class})
    public ResponseEntity<ApiError> handleBadRequestExceptions(Exception ex, WebRequest request) {
        return buildResponseEntity(HttpStatus.BAD_REQUEST, ex, request);
    }

    @ExceptionHandler({DuplicateResourceException.class, IllegalStateException.class})
    public ResponseEntity<ApiError> handleConflictExceptions(Exception ex, WebRequest request) {
        return buildResponseEntity(HttpStatus.CONFLICT, ex, request);
    }

    @ExceptionHandler({NullPointerException.class, InvalidTokenException.class, ResourceNotFoundException.class, EntityNotFoundException.class})
    public ResponseEntity<ApiError> handleNotFoundExceptions(Exception ex, WebRequest request) {
        return buildResponseEntity(HttpStatus.NOT_FOUND, ex, request);
    }

    @ExceptionHandler({MessagingException.class, EmailSendingException.class})
    public ResponseEntity<ApiError> handleInternalServerErrorExceptions(Exception ex, WebRequest request) {
        return buildResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, ex, request);
    }

    @ExceptionHandler({InsufficientAuthenticationException.class,
            AuthenticationException.class, JwtException.class, BadCredentialsException.class})
    public ResponseEntity<ApiError> handleAuthExceptions(Exception ex, WebRequest request) {
        return buildResponseEntity(HttpStatus.UNAUTHORIZED, ex, request);
    }

    @ExceptionHandler({HttpRequestMethodNotSupportedException.class ,IllegalArgumentException.class})
    public ResponseEntity<ApiError> handleMethodNotSupportedException(Exception ex, WebRequest request) {
        return buildResponseEntity(HttpStatus.METHOD_NOT_ALLOWED, ex, request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(Exception ex,
                                                    WebRequest request) {
        return buildResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, ex, request);
    }

    private ResponseEntity<ApiError> buildResponseEntity(HttpStatus status, Exception ex, WebRequest request) {
        ApiError apiError = new ApiError(
                status.value(),
                ex.getMessage(),
                request.getDescription(false),
                LocalDateTime.now()
        );
        return ResponseEntity.status(status).body(apiError);
    }

}
