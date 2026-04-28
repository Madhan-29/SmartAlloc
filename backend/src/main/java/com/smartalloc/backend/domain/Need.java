package com.smartalloc.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Need {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String category; // e.g., Food, Medical, Shelter, Education

    private Double latitude;
    private Double longitude;

    private Integer urgency; // 1 to 10 (10 being most urgent)

    private String status; // OPEN, IN_PROGRESS, RESOLVED

    private LocalDateTime createdAt = LocalDateTime.now();
}
