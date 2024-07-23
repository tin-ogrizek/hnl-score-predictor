package com.collectablestickers.StickerCollectingApp.controller;

import com.collectablestickers.StickerCollectingApp.dto.TableRowDTO;
import com.collectablestickers.StickerCollectingApp.entity.Fixture;
import com.collectablestickers.StickerCollectingApp.service.FixtureService;
import com.collectablestickers.StickerCollectingApp.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/predictor")
public class FixtureController {

    @Autowired
    private FixtureService fixtureService;

    @Autowired
    private TableService tableService;

    @GetMapping("/match-days")
    public ResponseEntity<Object> getAllPlayedMatchdays(){
        try {
            Map<String, List<Fixture>> allPlayedFixtures = fixtureService.getPlayedFixtures();
            return ResponseEntity.ok(allPlayedFixtures);
        } catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/hnl-table")
    public ResponseEntity<Object> getHNLTableData() {
        try {
            List<TableRowDTO> tableRowDTOS = tableService.fetchTableData();
            return ResponseEntity.ok(tableRowDTOS);
        } catch (Error e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
