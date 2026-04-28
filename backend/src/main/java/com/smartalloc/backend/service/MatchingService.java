package com.smartalloc.backend.service;

import com.smartalloc.backend.domain.Need;
import com.smartalloc.backend.domain.Volunteer;
import com.smartalloc.backend.repository.NeedRepository;
import com.smartalloc.backend.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final NeedRepository needRepository;
    private final VolunteerRepository volunteerRepository;

    // Calculates Haversine distance in km
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<Need> getMatchesForVolunteer(Long volunteerId) {
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));

        List<Need> allNeeds = needRepository.findByStatus("OPEN");

        return allNeeds.stream()
                .filter(need -> calculateDistance(volunteer.getLatitude(), volunteer.getLongitude(), 
                                                  need.getLatitude(), need.getLongitude()) < 50.0) // Within 50km
                // Basic skill matching if applicable
                .filter(need -> volunteer.getSkills().toLowerCase().contains(need.getCategory().toLowerCase()) 
                                || volunteer.getSkills().toLowerCase().contains("general"))
                .sorted(Comparator.comparing(Need::getUrgency).reversed() // Highest urgency first
                        .thenComparing(need -> calculateDistance(volunteer.getLatitude(), volunteer.getLongitude(), 
                                                                 need.getLatitude(), need.getLongitude()))) // Then closest
                .collect(Collectors.toList());
    }

    public List<Volunteer> getMatchesForNeed(Long needId) {
        Need need = needRepository.findById(needId)
                .orElseThrow(() -> new RuntimeException("Need not found"));

        List<Volunteer> allVolunteers = volunteerRepository.findByAvailableTrue();

        return allVolunteers.stream()
                .filter(vol -> calculateDistance(need.getLatitude(), need.getLongitude(), 
                                                 vol.getLatitude(), vol.getLongitude()) < 50.0)
                .filter(vol -> vol.getSkills().toLowerCase().contains(need.getCategory().toLowerCase()) 
                               || vol.getSkills().toLowerCase().contains("general"))
                .sorted(Comparator.comparing(vol -> calculateDistance(need.getLatitude(), need.getLongitude(), 
                                                                      vol.getLatitude(), vol.getLongitude()))) // Closest first
                .collect(Collectors.toList());
    }
}
