package com.collectablestickers.StickerCollectingApp.service;

import com.collectablestickers.StickerCollectingApp.entity.User;
import com.collectablestickers.StickerCollectingApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean changeCurrentPassword(Long userId, String password,
                                         String oldPassword, String newPassword,
                                         String repeatNewPassword) {


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Korisnik nije pronađen."));

        if(!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw  new IllegalArgumentException("Pogrešna trenutna lozinka.");
        }

        if(passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new IllegalArgumentException("Nova lozinka mora biti različita od stare.");
        }

        if(!newPassword.equals(repeatNewPassword)) {
            throw new IllegalArgumentException("Ponovljena nova lozinka mora biti jednaka novoj lozinci.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return true;
    }
}
