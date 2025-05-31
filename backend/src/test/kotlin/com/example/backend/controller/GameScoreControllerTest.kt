package com.example.backend.controller

import com.example.backend.model.RequestScore
import com.example.backend.model.ResponseScore
import com.example.backend.service.GameScoreService
import com.fasterxml.jackson.databind.ObjectMapper
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

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Test
  fun `getModeScoreが呼ばれたときOKを返しserviceのgetScoreを呼んでいること`() {
    every { gameScoreService.getScore(any(), any(), any()) } returns
      listOf(
        ResponseScore(
          id = 1,
          createdAt = Instant.now(),
          gameScore = 200,
          numberOfCard = 12,
          user = "testUser",
          elapsedTimeMillis = 1000,
          missCount = 10,
        ),
      )
//    todo paramsのnameを実装と紐づけたい
    mockMvc.perform(
      MockMvcRequestBuilders.get(
        "/api/score",
      ).param("gameModeId", "1") // ?gameMode=irasutoya
        .param("numberOfCard", "12")
        .param("gameLevelId", "2"),
    ).andExpect(status().isOk)

    verify { gameScoreService.getScore(1, 12, 2) }
  }

  @Test
  fun `postModeScoreが呼ばれた時Createdを返しserviceのpostScoreを読んでいること`() {
    every { gameScoreService.postScore(any()) } returns Unit

    val request =
      RequestScore(
        user = "Masaru",
        gameModeId = 1,
        gameScore = 2,
        numberOfCard = "12",
        elapsedTimeMillis = 1000,
        missCount = 10,
        gameLevelId = 1,
      )
    val json = objectMapper.writeValueAsString(request)

    mockMvc.perform(
      MockMvcRequestBuilders.post(
        "/api/score",
      ).contentType(MediaType.APPLICATION_JSON).content(json),
    )
      .andExpect(status().isCreated)

    verify {
      gameScoreService.postScore(
        RequestScore(
          user = "Masaru",
          gameModeId = 1,
          gameScore = 2,
          numberOfCard = "12",
          elapsedTimeMillis = 1000,
          missCount = 10,
          gameLevelId = 1,
        ),
      )
    }
  }
}
