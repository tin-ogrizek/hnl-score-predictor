package com.collectablestickers.StickerCollectingApp.service;

import com.collectablestickers.StickerCollectingApp.entity.Fixture;
import com.collectablestickers.StickerCollectingApp.repository.FixtureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FixtureService {

    @Autowired
    private FixtureRepository fixtureRepository;

    public Map<String, List<Fixture>> getPlayedFixtures() {
        List<Fixture> allFixtures = fixtureRepository.findAll();
        allFixtures.sort(Comparator.comparing(Fixture::getGameTime));
        Map<String, List<Fixture>> playedFixturesByMatchday = new HashMap<>();

        Map<String, List<Fixture>> helpingMap = new HashMap<>();


        for (Fixture fix : allFixtures){
            playedFixturesByMatchday.putIfAbsent(fix.getMatchDay(), new ArrayList<>());
            playedFixturesByMatchday.get(fix.getMatchDay()).add(fix);
        }


        Map<String, List<Fixture>> sortedMap = playedFixturesByMatchday.entrySet().stream()
                .sorted(Comparator.comparingInt(entry -> extractNumber(entry.getKey())))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().stream()
                                .sorted(Comparator.comparing(Fixture::getGameTime))
                                .collect(Collectors.toList()),
                        (oldValue, newValue) -> oldValue,
                        LinkedHashMap::new)
                );

        String latestFullyPlayedMatchday = null;
        for(String matchdayKey : sortedMap.keySet()){

            List<Fixture> fixtureList = sortedMap.get(matchdayKey);

            if(fixtureList.get(fixtureList.size() - 1).getGameTime().isBefore(LocalDateTime.now())){
                latestFullyPlayedMatchday = matchdayKey;
            } else {
                break;
            }
        }

        String finalLatestFullyPlayedMatchday = latestFullyPlayedMatchday;
        List<Fixture> playedFixtures = new ArrayList<>();
        if(finalLatestFullyPlayedMatchday != null){
            playedFixtures = allFixtures.stream()
                    .filter(fixture -> {
                        int latestMatchdayNumber = Integer.parseInt(finalLatestFullyPlayedMatchday.split("\\.")[0].trim());
                        int fixtureMatchdayNumber = Integer.parseInt(fixture.getMatchDay().split("\\.")[0].trim());
                        return fixtureMatchdayNumber <= latestMatchdayNumber;
                    })
                    .toList();
        }

        for (Fixture fixture : playedFixtures) {
            helpingMap.putIfAbsent(fixture.getMatchDay(), new ArrayList<>());
            helpingMap.get(fixture.getMatchDay()).add(fixture);
        }


        Map<String, List<Fixture>> secondSortedMap = helpingMap.entrySet().stream()
                .sorted(Comparator.comparingInt(entry -> extractNumber(entry.getKey())))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().stream()
                                .sorted(Comparator.comparing(Fixture::getGameTime))
                                .collect(Collectors.toList()),
                        (oldValue, newValue) -> oldValue,
                        LinkedHashMap::new)
                );


        if (latestFullyPlayedMatchday != null) {
            int nextMatchdayNumber = extractNumber(latestFullyPlayedMatchday) + 1;
            String nextMatchdayKey = nextMatchdayNumber + ". kolo";

            List<Fixture> nextMatchdayFixtures = allFixtures.stream()
                    .filter(fixture -> fixture.getMatchDay().equals(nextMatchdayKey))
                    .collect(Collectors.toList());

            if (!nextMatchdayFixtures.isEmpty() && nextMatchdayNumber <= 36) {
                secondSortedMap.put(nextMatchdayKey, nextMatchdayFixtures);
            }
        } else { // slucaj kad se nije odigralo jos nijedno kolo
            String nextMatchdayKey = "1. kolo";
            List<Fixture> nextMatchdayFixtures = allFixtures.stream()
                    .filter(fixture -> fixture.getMatchDay().equals(nextMatchdayKey))
                    .collect(Collectors.toList());
            if (!nextMatchdayFixtures.isEmpty()) {
                secondSortedMap.put(nextMatchdayKey, nextMatchdayFixtures);
            }
        }

        return secondSortedMap;
    }
    private int extractNumber(String key) {
        String[] parts = key.split("\\.");
        return Integer.parseInt(parts[0]);
    }
}
