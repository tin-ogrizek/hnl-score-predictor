package com.collectablestickers.StickerCollectingApp.service;

import com.collectablestickers.StickerCollectingApp.dto.TableRowDTO;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import javax.swing.text.TableView;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class TableService {

    public List<TableRowDTO> fetchTableData() throws IOException {
        List<TableRowDTO> tableData = new ArrayList<>();
        Document doc = Jsoup.connect("https://hnl.hr/statistika/ljestvica/").get();
        Elements TableRowDTOs = doc.select("table.table1 tbody tr");
        for (Element row : TableRowDTOs) {
            TableRowDTO rowData = new TableRowDTO();
            rowData.setPosition(row.child(0).text());
            rowData.setClub(row.child(1).text());
            rowData.setMatches(row.child(2).text());
            rowData.setWins(row.child(3).text());
            rowData.setDraws(row.child(4).text());
            rowData.setLosses(row.child(5).text());
            rowData.setGoalsFor(row.child(6).text());
            rowData.setGoalsAgainst(row.child(7).text());
            rowData.setGoalDifference(row.child(8).text());
            rowData.setPoints(row.child(9).text());
            tableData.add(rowData);
        }
        return tableData;
    }
}

