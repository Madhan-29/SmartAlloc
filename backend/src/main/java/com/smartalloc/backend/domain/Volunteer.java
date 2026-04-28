package com.smartalloc.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Volunteer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    
    // Comma-separated or string representation for simplicity in a hackathon
    private String skills; 

    private Double latitude;
    private Double longitude;

    private Boolean available = true;

    private LocalDateTime registeredAt = LocalDateTime.now();
}
