package com.example.backened.controller

import com.example.backened.model.RequestScore
import com.example.backened.model.ResponseScore
import com.example.backened.service.GameScoreService
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.verify
import org.springframework.http.MediaType
import java.time.Instant
import java.time.LocalDateTime


@SpringBootTest
@AutoConfigureMockMvc
class GameScoreControllerTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockkBean
    lateinit var gameScoreService: GameScoreService

    @Test
    fun getModeScoreが呼ばれたときOKを返しserviceのgetScoreを呼んでいること() {
        every { gameScoreService.getScore(any()) } returns listOf(
            ResponseScore(
                id = 1,
                createdAt = Instant.now(),
                gameScore = 200,
                user = "testUser"
            )
        )

        mockMvc.perform(MockMvcRequestBuilders.get("/api/score/irasutoya")).andExpect(status().isOk)

        verify { gameScoreService.getScore("irasutoya") }
    }

    @Test
    fun postModeScoreが呼ばれた時Createdを返しserviceのpostScoreを読んでいること() {
        every { gameScoreService.postScore(any()) } returns Unit

        mockMvc.perform(
            MockMvcRequestBuilders.post("/api/score").contentType(MediaType.APPLICATION_JSON).content(
                """{
                                "user": "Masaru",
                                "gameMode": "irasutoya",
                                "gameScore": 2
                            }
                        """.trimIndent(),
            )
        )
            .andExpect(status().isCreated)

        verify { gameScoreService.postScore(RequestScore(user = "Masaru", gameMode = "irasutoya" ,gameScore = 2)) }
    }
}