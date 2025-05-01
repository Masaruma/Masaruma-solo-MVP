package com.example.backened.repository

import com.example.backened.model.GameLevel
import org.springframework.data.jpa.repository.JpaRepository

interface JPAGameLevelRepository: JpaRepository<GameLevel, Int> {
    fun findByLevel(gameLevel: Int): GameLevel
}
