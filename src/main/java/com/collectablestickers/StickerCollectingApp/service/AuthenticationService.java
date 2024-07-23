package com.collectablestickers.StickerCollectingApp.service;

import com.collectablestickers.StickerCollectingApp.entity.Role;
import com.collectablestickers.StickerCollectingApp.entity.User;
import com.collectablestickers.StickerCollectingApp.repository.UserRepository;
import com.collectablestickers.StickerCollectingApp.request.AuthenticationRequest;
import com.collectablestickers.StickerCollectingApp.request.RegisterRequest;
import com.collectablestickers.StickerCollectingApp.response.AuthenticationResponse;
import com.collectablestickers.StickerCollectingApp.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.Console;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Service
public class AuthenticationService {

    private final UserRepository repository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository repository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse register(RegisterRequest request){

        if(repository.existsByUsername(request.getUsername())){
            throw new IllegalArgumentException("Username (" + request.getUsername() + ") is already taken.");
        }

        User user = new User();
        user.setRole(Role.USER);
        user.setPoints(0);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getUsername());
        user.setUserAccStartDate(LocalDate.now());
        user.setLastPasswordChange(LocalDateTime.now());

        System.out.println(user);

        user = repository.save(user);

        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request){
        User user = repository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new IllegalArgumentException("User ("
                                + request.getUsername() + ") not found."));

        String storedEncodedPassword = user.getPassword();
        String enteredPassword = request.getPassword();

        if(!passwordEncoder.matches(enteredPassword, storedEncodedPassword)){
            throw new IllegalArgumentException("Wrong password!");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token);
    }
}
