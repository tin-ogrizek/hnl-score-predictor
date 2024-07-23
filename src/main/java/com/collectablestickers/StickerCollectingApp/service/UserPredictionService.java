package com.collectablestickers.StickerCollectingApp.service;

import com.collectablestickers.StickerCollectingApp.entity.Fixture;
import com.collectablestickers.StickerCollectingApp.entity.User;
import com.collectablestickers.StickerCollectingApp.entity.UserPrediction;
import com.collectablestickers.StickerCollectingApp.repository.FixtureRepository;
import com.collectablestickers.StickerCollectingApp.repository.UserPredictionRepository;
import com.collectablestickers.StickerCollectingApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserPredictionService {

    @Autowired
    private UserPredictionRepository userPredictionRepository;

    @Autowired
    private FixtureRepository fixtureRepository;

    @Autowired
    private UserRepository userRepository;

    public List<UserPrediction> getUserPredictions(Long userId) {
        //calculatePointsForAllUsers(userPredictionRepository.findAll());

        //updateUserPoints(userPredictions, userId);


        return userPredictionRepository.findByUserId(userId);
    }


    public void updateUserPoints(List<UserPrediction> userPredictions, List<User> allUsers) {
        for (User user : allUsers) {
            int totalUserPoints = 0;
            for (UserPrediction userPrediction : userPredictions) {
                if (userPrediction.getUser().getId().equals(user.getId())) {
                    totalUserPoints += userPrediction.getFixturePoints();
                }
            }
            user.setPoints(totalUserPoints);
            userRepository.save(user);
        }
    }

    public void calculatePointsForAllUsers(List<UserPrediction> allPredictions) {
        for(UserPrediction prediction : allPredictions){
            Fixture fixture = prediction.getFixture();
            if(fixture != null && !fixture.getHomeTeamScore().isEmpty() && !fixture.getAwayTeamScore().isEmpty()
            && !Objects.equals(prediction.getAwayScorePrediction(), "") && !Objects.equals(prediction.getHomeScorePrediction(), "")){
                int points = calculatePoints(prediction, fixture);
                prediction.setFixturePoints(points);
                userPredictionRepository.save(prediction);
            }
        }
    }

    public int calculatePoints(UserPrediction prediction, Fixture fixture) {
        int points = 0;

        Integer predictionHomeScore = Integer.parseInt(prediction.getHomeScorePrediction());
        Integer predictionAwayScore = Integer.parseInt(prediction.getAwayScorePrediction());
        Integer realHomeScore = Integer.parseInt(fixture.getHomeTeamScore());
        Integer realAwayScore = Integer.parseInt(fixture.getAwayTeamScore());


        /**
         * Tocno predvidanje pobjednika ili gubitnika, ili izjednacenog rezultata: +2 boda
         *
         * Tocan broj golova domace ekipe: +1 bod
         * Tocan broj golova gostujuce ekipe: +1 bod
         * Tocna gol razlika: +1 bod
         */


        if((predictionHomeScore > predictionAwayScore && realHomeScore > realAwayScore)
                || (predictionHomeScore < predictionAwayScore && realHomeScore < realAwayScore)
                || (predictionHomeScore.equals(predictionAwayScore) && realHomeScore.equals(realAwayScore))){
            points += 2;
        }

        if(predictionHomeScore.equals(realHomeScore)){
            points += 1;
        }

        if(predictionAwayScore.equals(realAwayScore)){
            points += 1;
        }

        if(Math.abs(predictionHomeScore - predictionAwayScore) == Math.abs(realHomeScore - realAwayScore)){
            points += 1;
        }

        return points;
    }


    public UserPrediction saveUserPrediction(String userAwayTeamScore, String userHomeTeamScore, Long fixtureId, Long userId) {

        Optional<User> user = userRepository.findById(userId);

        Optional<Fixture> fixture = fixtureRepository.findById(fixtureId);

        if(user.isPresent() && fixture.isPresent()){
            Optional<UserPrediction> existingPrediction = userPredictionRepository.findByUserIdAndFixtureId(userId, fixtureId);
            if(existingPrediction.isPresent()){
                UserPrediction predictionToUpdate = existingPrediction.get();
                predictionToUpdate.setHomeScorePrediction(userHomeTeamScore);
                predictionToUpdate.setAwayScorePrediction(userAwayTeamScore);

                return userPredictionRepository.save(predictionToUpdate);
            } else{
                UserPrediction newUserPrediction  = new UserPrediction();
                newUserPrediction.setUser(user.get());
                newUserPrediction.setFixture(fixture.get());
                newUserPrediction.setAwayScorePrediction(userAwayTeamScore);
                newUserPrediction.setHomeScorePrediction(userHomeTeamScore);
                newUserPrediction.setFixturePoints(0);

                return userPredictionRepository.save(newUserPrediction);
            }
        }
        return null;
    }

    public UserPrediction saveUserHomePrediction(String inputResult, Long fixtureId, Long userId) {
        Optional<User> user = userRepository.findById(userId);

        Optional<Fixture> fixture = fixtureRepository.findById(fixtureId);

        if(user.isPresent() && fixture.isPresent()){
            Optional<UserPrediction> existingPrediction = userPredictionRepository.findByUserIdAndFixtureId(userId, fixtureId);
            if(existingPrediction.isPresent()){
                UserPrediction predictionToUpdate = existingPrediction.get();
                predictionToUpdate.setHomeScorePrediction(inputResult);

                return userPredictionRepository.save(predictionToUpdate);
            } else{
                UserPrediction newUserPrediction  = new UserPrediction();
                newUserPrediction.setUser(user.get());
                newUserPrediction.setFixture(fixture.get());
                newUserPrediction.setHomeScorePrediction(inputResult);
                newUserPrediction.setFixturePoints(0);

                return userPredictionRepository.save(newUserPrediction);
            }
        }
        return null;
    }

    public UserPrediction saveUserAwayPrediction(String inputResult, Long fixtureId, Long userId) {
        Optional<User> user = userRepository.findById(userId);

        Optional<Fixture> fixture = fixtureRepository.findById(fixtureId);

        if(user.isPresent() && fixture.isPresent()){
            Optional<UserPrediction> existingPrediction = userPredictionRepository.findByUserIdAndFixtureId(userId, fixtureId);
            if(existingPrediction.isPresent()){
                UserPrediction predictionToUpdate = existingPrediction.get();
                predictionToUpdate.setAwayScorePrediction(inputResult);

                return userPredictionRepository.save(predictionToUpdate);
            } else{
                UserPrediction newUserPrediction  = new UserPrediction();
                newUserPrediction.setUser(user.get());
                newUserPrediction.setFixture(fixture.get());
                newUserPrediction.setAwayScorePrediction(inputResult);
                newUserPrediction.setFixturePoints(0);

                return userPredictionRepository.save(newUserPrediction);
            }
        }
        return null;
    }

    public Map<String, Integer> getLeaderboards() {
        Map<String, Integer> scores = new HashMap<>();
        List<User> listOfUsers = userRepository.findAll();

        for (User user : listOfUsers) {
            scores.put(user.getUsername(), user.getPoints());
        }

        return scores;
    }
}
