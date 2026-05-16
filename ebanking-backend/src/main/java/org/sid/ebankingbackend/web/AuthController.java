package org.sid.ebankingbackend.web;

import lombok.RequiredArgsConstructor;
import org.sid.ebankingbackend.dtos.AuthResponse;
import org.sid.ebankingbackend.dtos.LoginRequest;
import org.sid.ebankingbackend.dtos.RegisterRequest;
import org.sid.ebankingbackend.entities.AppUser;
import org.sid.ebankingbackend.repositories.UserRepository;
import org.sid.ebankingbackend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        AppUser user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        Map<String, Object> claims = Map.of(
                "role", user.getRole(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName()
        );
        String token = jwtUtil.generateToken(userDetails, claims);

        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                jwtUtil.getExpiration()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email deja utilise."));
        }

        AppUser user = new AppUser();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getEmail().toLowerCase().contains("admin") ? "ADMIN" : "USER");
        user.setEnabled(true);
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        Map<String, Object> claims = Map.of(
                "role", user.getRole(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName()
        );
        String token = jwtUtil.generateToken(userDetails, claims);

        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                jwtUtil.getExpiration()
        ));
    }
}
