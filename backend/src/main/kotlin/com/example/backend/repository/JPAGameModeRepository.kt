package com.example.backend.repository

import com.example.backend.model.GameMode
import org.springframework.data.jpa.repository.JpaRepository

interface JPAGameModeRepository: JpaRepository<GameMode, Int> {
    fun findByGameName(gameName: String): GameMode
}
