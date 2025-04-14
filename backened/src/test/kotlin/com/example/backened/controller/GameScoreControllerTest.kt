package com.example.backened.controller

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

@SpringBootTest
@AutoConfigureMockMvc
class GameScoreControllerTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Test
    fun `getScoreが呼ばれたときOKを返すこと`() {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/score/1")).andExpect(status().isOk)
            .andExpect(content().string("1"))
    }
}