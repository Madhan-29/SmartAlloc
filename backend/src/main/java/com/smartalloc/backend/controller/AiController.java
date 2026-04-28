package com.smartalloc.backend.controller;

import com.smartalloc.backend.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final GeminiService geminiService;

    /**
     * POST /api/ai/analyze
     * Body: { "text": "raw survey text here..." }
     * Returns: { "title", "description", "category", "urgency" }
     */
    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeSurvey(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        if (text == null || text.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Survey text cannot be empty"));
        }
        Map<String, Object> result = geminiService.analyzeSurveyReport(text);
        return ResponseEntity.ok(result);
    }
}
