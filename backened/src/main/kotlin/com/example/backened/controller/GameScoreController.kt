package com.example.backened.controller

import com.example.backened.service.GameScoreService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class GameScoreController (private val gameScoreService: GameScoreService) {

    @GetMapping("/score/{mode}")
    fun getModeScore(@PathVariable mode:String): String{
        return gameScoreService.getScore(mode)
    }
}