package com.example.backend.repository

import com.example.backend.model.Score
import org.springframework.data.jpa.repository.JpaRepository

interface JPAGameScoreRepository : JpaRepository<Score, Int> {
  // GameMode の gameName で検索
  fun findByGameModeGameNameAndNumberOfCardsNumberOfCard(
    gameName: String,
    numberOfCard: Int,
  ): List<Score>
}
