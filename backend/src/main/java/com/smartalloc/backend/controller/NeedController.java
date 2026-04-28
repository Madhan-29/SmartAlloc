package com.smartalloc.backend.controller;

import com.smartalloc.backend.domain.Need;
import com.smartalloc.backend.domain.Volunteer;
import com.smartalloc.backend.repository.NeedRepository;
import com.smartalloc.backend.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/needs")
@RequiredArgsConstructor
public class NeedController {

    private final NeedRepository needRepository;
    private final MatchingService matchingService;

    @GetMapping
    public List<Need> getAllNeeds() {
        return needRepository.findAll();
    }

    @PostMapping
    public Need createNeed(@RequestBody Need need) {
        if(need.getStatus() == null) {
            need.setStatus("OPEN");
        }
        return needRepository.save(need);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Need> getNeedById(@PathVariable Long id) {
        return needRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Need> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return needRepository.findById(id)
                .map(need -> {
                    need.setStatus(status);
                    return ResponseEntity.ok(needRepository.save(need));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Matching endpoint: Find best volunteers for this need
    @GetMapping("/{id}/matches")
    public ResponseEntity<List<Volunteer>> getMatchesForNeed(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(matchingService.getMatchesForNeed(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
