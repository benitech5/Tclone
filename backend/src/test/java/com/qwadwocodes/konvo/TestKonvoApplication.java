package com.qwadwocodes.konvo;

import org.springframework.boot.SpringApplication;

public class TestKonvoApplication {

    public static void main(String[] args) {
        SpringApplication.from(KonvoApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
