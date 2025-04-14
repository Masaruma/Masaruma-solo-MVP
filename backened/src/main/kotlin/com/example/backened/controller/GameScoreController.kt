package com.example.backened.controller

import jakarta.websocket.server.PathParam
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class GameScoreController {

    @GetMapping("/score/{mode}")
    fun getScore(@PathVariable mode:String): String{
        return mode
    }
}