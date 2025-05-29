package com.example.backend.controller

import com.example.backend.model.RequestScore
import com.example.backend.model.ResponseScore
import com.example.backend.service.GameScoreService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class GameScoreController(private val gameScoreService: GameScoreService) {
  @GetMapping("/score")
  fun getModeScore(
    @RequestParam gameModeId: Int,
    @RequestParam numberOfCard: Int,
    @RequestParam gameLevelId: Int,
  ): List<ResponseScore> {
    return gameScoreService.getScore(gameModeId, numberOfCard,gameLevelId)
  }

  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping("/score")
  fun postScore(
    @RequestBody requestData: RequestScore,
  ) {
    gameScoreService.postScore(requestData)
  }
}
