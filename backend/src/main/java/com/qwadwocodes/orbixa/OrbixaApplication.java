
package com.qwadwocodes.orbixa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.qwadwocodes.orbixa")
public class OrbixaApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrbixaApplication.class, args);
    }

}
