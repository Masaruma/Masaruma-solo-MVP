package com.example.backened.repository

import com.example.backened.model.GameLevel
import com.example.backened.model.GameMode
import com.example.backened.model.Score
import org.springframework.data.jpa.repository.JpaRepository

interface JPAGameScoreRepository:JpaRepository<Score, Int>{
    // GameMode の gameName で検索
    fun findByGameModeGameName(gameName: String): List<Score>
    fun findByGameModeGameNameAndGameLevelLevel(gameName: String, level: Int): List<Score>
}