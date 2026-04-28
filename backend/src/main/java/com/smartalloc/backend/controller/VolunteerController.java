package com.smartalloc.backend.controller;

import com.smartalloc.backend.domain.Need;
import com.smartalloc.backend.domain.Volunteer;
import com.smartalloc.backend.repository.VolunteerRepository;
import com.smartalloc.backend.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/volunteers")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerRepository volunteerRepository;
    private final MatchingService matchingService;

    @GetMapping
    public List<Volunteer> getAllVolunteers() {
        return volunteerRepository.findAll();
    }

    @PostMapping
    public Volunteer registerVolunteer(@RequestBody Volunteer volunteer) {
        if(volunteer.getAvailable() == null) {
            volunteer.setAvailable(true);
        }
        return volunteerRepository.save(volunteer);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Volunteer> getVolunteerById(@PathVariable Long id) {
        return volunteerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Volunteer> updateAvailability(@PathVariable Long id, @RequestParam Boolean available) {
        return volunteerRepository.findById(id)
                .map(vol -> {
                    vol.setAvailable(available);
                    return ResponseEntity.ok(volunteerRepository.save(vol));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Matching endpoint: Find best tasks/needs for this volunteer
    @GetMapping("/{id}/matches")
    public ResponseEntity<List<Need>> getMatchesForVolunteer(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(matchingService.getMatchesForVolunteer(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
