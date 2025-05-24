package com.example.backend.controller

import com.example.backend.model.RequestScore
import com.example.backend.model.ResponseScore
import com.example.backend.service.GameScoreService
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.verify
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.Instant

@SpringBootTest
@AutoConfigureMockMvc
class GameScoreControllerTest {
  @Autowired
  private lateinit var mockMvc: MockMvc

  @MockkBean
  lateinit var gameScoreService: GameScoreService

  @Test
  fun `getModeScoreが呼ばれたときOKを返しserviceのgetScoreを呼んでいること`() {
    every { gameScoreService.getScore(any(), any()) } returns
      listOf(
        ResponseScore(
          id = 1,
          createdAt = Instant.now(),
          gameScore = 200,
          gameLevel = 12,
          user = "testUser",
          elapsedTimeMillis = 1000,
          missCount = 10,
        ),
      )

    mockMvc.perform(
      MockMvcRequestBuilders.get(
        "/api/score",
      ).param("gameMode", "irasutoya") // ?gameMode=irasutoya
        .param("gameLevel", "12"),
    ).andExpect(status().isOk)

    verify { gameScoreService.getScore("irasutoya", 12) }
  }

  @Test
  fun `postModeScoreが呼ばれた時Createdを返しserviceのpostScoreを読んでいること`() {
    every { gameScoreService.postScore(any()) } returns Unit

    mockMvc.perform(
      MockMvcRequestBuilders.post(
        "/api/score",
      ).contentType(MediaType.APPLICATION_JSON).content(
        """
        {
            "user": "Masaru",
            "gameMode": "irasutoya",
            "gameLevel": "12",
            "gameScore": 2,
            "elapsedTimeMillis" : 1000,
            "missCount" : 10,
        }
        """.trimIndent(),
      ),
    )
      .andExpect(status().isCreated)

    verify {
      gameScoreService.postScore(
        RequestScore(
          user = "Masaru",
          gameMode = "irasutoya",
          gameScore = 2,
          gameLevel = "12",
          elapsedTimeMillis = 1000,
          missCount = 10,
        ),
      )
    }
  }
}
