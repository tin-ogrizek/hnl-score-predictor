package com.collectablestickers.StickerCollectingApp.service;

import com.collectablestickers.StickerCollectingApp.entity.Fixture;
import com.collectablestickers.StickerCollectingApp.entity.User;
import com.collectablestickers.StickerCollectingApp.entity.UserPrediction;
import com.collectablestickers.StickerCollectingApp.repository.FixtureRepository;
import com.collectablestickers.StickerCollectingApp.repository.UserPredictionRepository;
import com.collectablestickers.StickerCollectingApp.repository.UserRepository;
import com.collectablestickers.StickerCollectingApp.response.ProfileResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPredictionRepository userPredictionRepository;

    @Autowired
    private FixtureRepository fixtureRepository;

    @Autowired
    private FixtureService fixtureService;

    public ProfileResponse getUserProfileData(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<UserPrediction> userPredictions = userPredictionRepository.findByUserId(id);

        Map<String, List<Fixture>> mapOfPlayedFixtures = fixtureService.getPlayedFixtures();

        int maxPoints = 0;
        String mostSuccessMatchday = null;
        int totalCorrectPredictions = 0;

        for (Map.Entry<String, List<Fixture>> entry : mapOfPlayedFixtures.entrySet()) {
            String matchday = entry.getKey();
            List<Fixture> fixtures = entry.getValue();
            int matchdayPoints = 0;

            for (Fixture fixture : fixtures) {
                Optional<UserPrediction> userPredictionOptional = userPredictions.stream()
                        .filter(prediction -> prediction.getFixture().getId().equals(fixture.getId()))
                        .findFirst();

                if (userPredictionOptional.isPresent()) {
                    UserPrediction userPrediction = userPredictionOptional.get();
                    matchdayPoints += userPrediction.getFixturePoints();
                    if (userPrediction.getHomeScorePrediction().equals(fixture.getHomeTeamScore()) &&
                    userPrediction.getAwayScorePrediction().equals(fixture.getAwayTeamScore())) {
                        totalCorrectPredictions++;
                    }
                }
            }

            if (matchdayPoints > maxPoints) {
                maxPoints = matchdayPoints;
                mostSuccessMatchday = matchday;
            }
        }


        ProfileResponse profileResponse = ProfileResponse.builder()
                .username(user.getUsername())
                .accStartDate(user.getUserAccStartDate())
                .totalUserPoints(user.getPoints())
                .numOfGuessMatchdays(totalCorrectPredictions)
                .mostSuccessMatchday(mostSuccessMatchday)
                .build();

        return profileResponse;

    }
}
