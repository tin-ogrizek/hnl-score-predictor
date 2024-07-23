package com.collectablestickers.StickerCollectingApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StickerCollectingApplication {

	public static void main(String[] args) {
		SpringApplication.run(StickerCollectingApplication.class, args);
	}

}
