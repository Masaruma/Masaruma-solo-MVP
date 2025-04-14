package com.example.backened.service

import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.PathVariable

interface GameScoreService {
    fun getScore(mode:String): String
}
@Service
class GameScoreServiceImpl: GameScoreService {
    override fun getScore(mode: String): String {
        TODO("Not yet implemented")
    }
}