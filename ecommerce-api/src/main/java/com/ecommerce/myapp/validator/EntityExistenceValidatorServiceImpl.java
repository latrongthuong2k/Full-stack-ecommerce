package com.ecommerce.myapp.validator;

import com.ecommerce.myapp.exceptions.ResourceNotFoundException;
import com.ecommerce.myapp.repositories.AppUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@AllArgsConstructor
public class EntityExistenceValidatorServiceImpl implements EntityExistenceValidatorService {
    private final AppUserRepository appUserRepository;

    @Override
    public void checkExistUser(Long userId) {
        if (!appUserRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User with id [%s] not found".formatted(userId));
        }
    }

}
