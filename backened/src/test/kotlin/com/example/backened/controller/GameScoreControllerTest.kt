package com.example.backened.controller

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


@SpringBootTest
@AutoConfigureMockMvc
class GameScoreControllerTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockkBean
    lateinit var gameScoreService: GameScoreService

    @Test
    fun getModeScoreが呼ばれたときOKを返しserviceのgetScoreを呼んでいること() {
        every { gameScoreService.getScore(any()) } returns "Aa"

        mockMvc.perform(MockMvcRequestBuilders.get("/api/score/1")).andExpect(status().isOk)
            .andExpect(content().string("Aa"))

        verify { gameScoreService.getScore(any()) }
    }
}