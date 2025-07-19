package com.qwadwocodes.orbixa.api;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ChatApiTest {

    @LocalServerPort
    private int port;

    private String authToken;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
        
        // Get auth token for testing
        authToken = getAuthToken();
    }

    @Test
    void testCreateChat_Success() {
        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body("{\"name\":\"Test Chat\",\"chatType\":\"GROUP\",\"memberIds\":[1,2]}")
        .when()
            .post("/api/chats")
        .then()
            .statusCode(200)
            .body("id", notNullValue())
            .body("name", equalTo("Test Chat"))
            .body("chatType", equalTo("GROUP"));
    }

    @Test
    void testCreateChat_Unauthorized() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"name\":\"Test Chat\",\"chatType\":\"GROUP\",\"memberIds\":[1,2]}")
        .when()
            .post("/api/chats")
        .then()
            .statusCode(401);
    }

    @Test
    void testGetChatById_Success() {
        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .get("/api/chats/1")
        .then()
            .statusCode(200)
            .body("id", equalTo(1))
            .body("name", notNullValue());
    }

    @Test
    void testGetChatById_NotFound() {
        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .get("/api/chats/999")
        .then()
            .statusCode(404);
    }

    @Test
    void testGetUserChats_Success() {
        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .get("/api/chats/user")
        .then()
            .statusCode(200)
            .body("$", hasSize(greaterThan(0)));
    }

    @Test
    void testAddMemberToChat_Success() {
        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body("{\"userId\":3,\"role\":\"MEMBER\"}")
        .when()
            .post("/api/chats/1/members")
        .then()
            .statusCode(200);
    }

    @Test
    void testRemoveMemberFromChat_Success() {
        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .delete("/api/chats/1/members/2")
        .then()
            .statusCode(200);
    }

    @Test
    void testGetChatMembers_Success() {
        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .get("/api/chats/1/members")
        .then()
            .statusCode(200)
            .body("$", hasSize(greaterThan(0)));
    }

    @Test
    void testUpdateChatName_Success() {
        given()
            .header("Authorization", "Bearer " + authToken)
            .contentType(ContentType.JSON)
            .body("{\"name\":\"Updated Chat Name\"}")
        .when()
            .put("/api/chats/1/name")
        .then()
            .statusCode(200);
    }

    @Test
    void testDeleteChat_Success() {
        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .delete("/api/chats/1")
        .then()
            .statusCode(200);
    }

    private String getAuthToken() {
        // This is a simplified version - in real tests you'd create a test user and get a real token
        return "test-token";
    }
} 