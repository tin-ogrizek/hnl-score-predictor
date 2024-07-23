package com.collectablestickers.StickerCollectingApp.controller;

import com.collectablestickers.StickerCollectingApp.dto.PasswordChangeDTO;
import com.collectablestickers.StickerCollectingApp.entity.User;
import com.collectablestickers.StickerCollectingApp.repository.UserRepository;
import com.collectablestickers.StickerCollectingApp.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin("*")
public class SettingsController {

    /* Ogranicavanje mogucnosti promjene lozinke na svakih # minuta */
    private static final int COOLDOWN_PERIOD_MINUTES = 48 * 60;

    @Autowired
    private SettingsService settingsService;


    @Autowired
    private UserRepository userRepository;

    @PostMapping("/change-password")
    public ResponseEntity<Object> changePassword(@AuthenticationPrincipal User user,
                                                 @RequestBody PasswordChangeDTO passwordChangeDTO) {

        try {
            LocalDateTime lastPasswordChange = user.getLastPasswordChange();

            long minutesSinceLastChange = ChronoUnit.MINUTES.between(lastPasswordChange, LocalDateTime.now());

            if (minutesSinceLastChange < COOLDOWN_PERIOD_MINUTES) {
                return ResponseEntity.badRequest().body("Trentno ne možete promijeniti lozinku. Pokušajte kasnije.");
            }


            boolean change = settingsService.changeCurrentPassword(user.getId(), user.getPassword(), passwordChangeDTO.getOldPassword(),
                    passwordChangeDTO.getNewPassword(), passwordChangeDTO.getRepeatNewPassword());
            if(change) {
                user.setLastPasswordChange(LocalDateTime.now());
                userRepository.save(user);

                return ResponseEntity.accepted().body(Map.of("message", "Uspješno promjenjena lozinka."));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Neuspjeh."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
