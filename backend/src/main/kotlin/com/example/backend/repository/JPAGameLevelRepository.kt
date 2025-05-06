package com.example.backend.repository

import com.example.backend.model.GameLevel
import org.springframework.data.jpa.repository.JpaRepository

interface JPAGameLevelRepository : JpaRepository<GameLevel, Int> {
  fun findByLevel(gameLevel: Int): GameLevel
}
