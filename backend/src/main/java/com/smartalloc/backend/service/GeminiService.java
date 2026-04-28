package com.smartalloc.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    @Value("${gemini.apiKey:}")
    private String apiKey;

    @jakarta.annotation.PostConstruct
    public void init() {
        if (apiKey != null && !apiKey.isBlank()) {
            log.info("Gemini API Key loaded (length: {})", apiKey.length());
        } else {
            log.warn("Gemini API Key is MISSING or empty!");
        }
    }

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String GEMINI_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

    /**
     * Analyzes raw survey text using the Gemini REST API and returns
     * structured data: title, description, category, urgency.
     */
    public Map<String, Object> analyzeSurveyReport(String rawText) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("No Gemini API key configured, using fallback analysis.");
            return mockAnalysis(rawText);
        }
        
        // Force try the real API
        try {
            String prompt = """
                    You are an expert at analyzing social welfare survey reports.
                    Analyze the following field report or survey text and extract structured data.
                    
                    IMPORTANT: Respond ONLY with a valid JSON object. No markdown, no code blocks, no explanations.
                    
                    The JSON must have exactly these fields:
                    - "title": short clear title (max 10 words)
                    - "description": concise summary (max 50 words)
                    - "category": one of [Medical, Food, Shelter, Education, Sanitation, Safety, General]
                    - "urgency": integer from 1-10 (10 = life-threatening)
                    
                    Survey Text:
                    """ + rawText;

            // Build request body matching Gemini REST API format
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(Map.of("text", prompt)))
                )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                GEMINI_URL + apiKey, HttpMethod.POST, entity, String.class
            );

            // Parse Gemini response: response.candidates[0].content.parts[0].text
            JsonNode root = objectMapper.readTree(response.getBody());
            String text = root.path("candidates").get(0)
                              .path("content").path("parts").get(0)
                              .path("text").asText()
                              .replaceAll("```json", "").replaceAll("```", "").trim();

            JsonNode json = objectMapper.readTree(text);
            Map<String, Object> result = new HashMap<>();
            result.put("title", json.path("title").asText());
            result.put("description", json.path("description").asText());
            result.put("category", json.path("category").asText());
            result.put("urgency", json.path("urgency").asInt());
            result.put("ai_powered", true);
            return result;

        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            return mockAnalysis(rawText);
        }
    }

    /**
     * Smart keyword-based fallback used when no API key is set or API fails.
     */
    private Map<String, Object> mockAnalysis(String rawText) {
        String lower = rawText.toLowerCase();
        String category = "General";
        int urgency = 5;

        if (lower.contains("medical") || lower.contains("hospital") || lower.contains("sick") || lower.contains("injured") || lower.contains("fever")) {
            category = "Medical"; urgency = 9;
        } else if (lower.contains("food") || lower.contains("hungry") || lower.contains("starving") || lower.contains("malnutrition")) {
            category = "Food"; urgency = 8;
        } else if (lower.contains("shelter") || lower.contains("homeless") || lower.contains("housing")) {
            category = "Shelter"; urgency = 7;
        } else if (lower.contains("school") || lower.contains("education") || lower.contains("children")) {
            category = "Education"; urgency = 6;
        } else if (lower.contains("water") || lower.contains("sanitation") || lower.contains("toilet")) {
            category = "Sanitation"; urgency = 7;
        } else if (lower.contains("danger") || lower.contains("unsafe") || lower.contains("crime")) {
            category = "Safety"; urgency = 9;
        }

        String trimmed = rawText.length() > 120 ? rawText.substring(0, 120).trim() + "..." : rawText.trim();
        Map<String, Object> result = new HashMap<>();
        result.put("title", "Community Need: " + category + " Required");
        result.put("description", "Field report summary: " + trimmed);
        result.put("category", category);
        result.put("urgency", urgency);
        result.put("ai_powered", false);
        result.put("ai_note", "Demo mode: No Gemini API key configured.");
        return result;
    }
}
