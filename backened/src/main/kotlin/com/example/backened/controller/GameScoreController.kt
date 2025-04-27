package com.example.backened.controller

import com.example.backened.model.RequestScore
import com.example.backened.model.ResponseScore
import com.example.backened.service.GameScoreService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class GameScoreController (private val gameScoreService: GameScoreService) {

    @GetMapping("/score/{mode}")
    fun getModeScore(@PathVariable mode:String): List<ResponseScore>{
        return gameScoreService.getScore(mode)
    }
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/score")
    fun postScore(@RequestBody requestData: RequestScore){
        gameScoreService.postScore(requestData)
    }
}