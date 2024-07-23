package com.collectablestickers.StickerCollectingApp.service;

import com.collectablestickers.StickerCollectingApp.entity.Fixture;
import com.collectablestickers.StickerCollectingApp.repository.FixtureRepository;
import com.collectablestickers.StickerCollectingApp.repository.FootballTeamRepository;
import com.collectablestickers.StickerCollectingApp.repository.UserPredictionRepository;
import com.collectablestickers.StickerCollectingApp.repository.UserRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class FixtureUpdateService {

    @Autowired
    private FixtureRepository fixtureRepository;

    @Autowired
    private FootballTeamRepository footballTeamRepository;

    @Autowired
    private UserPredictionService userPredictionService;

    @Autowired
    private UserPredictionRepository userPredictionRepository;

    @Autowired
    private UserRepository userRepository;

    @Scheduled(fixedRate = 86400000)
    public void updateFixtures(){
        System.out.println("Updating database at: " + LocalDateTime.now());
        String url = "https://hnl.hr/supersport-hnl/raspored-i-rezultati/";
        try{
            Document document = Jsoup.connect(url).get();
            Elements tableRows = document.select("table.table1.raspored.utakmice tr");

            String currentMatchday = null;

            for (Element row : tableRows){
                Element matchdayTag = row.selectFirst("th");
                if(matchdayTag != null){
                    currentMatchday = matchdayTag.ownText().trim();
                }

                Elements cols = row.select("td");
                if(cols.size() == 8){
                    String date = cols.get(0).ownText().trim();
                    String homeTeam = cols.get(1).text().trim();
                    String homeScore = cols.get(2).text().trim();
                    String awayScore = cols.get(4).text().trim();
                    String awayTeam = cols.get(5).text().trim();

                    LocalDateTime gameDate = null;

                    if(!date.equals("-")) {
                        gameDate = parseDateTime(date);
                    }

                    List<Fixture> fixtures = fixtureRepository.findAllByMatchDay(currentMatchday);

                    for(Fixture f : fixtures){
//                        if(f.getMatchDay().equals(currentMatchday) && f.getHomeTeam().getClubName().equals(homeTeam)
//                        && f.getAwayTeam().getClubName().equals(awayTeam)){
//                            f.setGameTime(gameDate);
//                            fixtureRepository.save(f);
//                        }
                        if ((!f.getAwayTeamScore().equals(awayScore)
                                || !f.getHomeTeamScore().equals(homeScore))
                                && f.getHomeTeam().getClubName().equals(homeTeam)
                                && f.getAwayTeam().getClubName().equals(awayTeam)){

                            if(gameDate != null){
                                if (!f.getGameTime().toString().equals(gameDate.toString())){
                                    f.setGameTime(gameDate);
                                }
                            }
                            f.setHomeTeamScore(homeScore);
                            f.setAwayTeamScore(awayScore);

                            fixtureRepository.save(f);
                        }
                    }
                }
            }
            userPredictionService.calculatePointsForAllUsers(userPredictionRepository.findAll());
            userPredictionService.updateUserPoints(userPredictionRepository.findAll(), userRepository.findAll());
        }catch (IOException e) {
            e.printStackTrace();
        }
    }
    private LocalDateTime parseDateTime(String dateTimeStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy. HH:mm");
        return LocalDateTime.parse(dateTimeStr, formatter);
    }
}
