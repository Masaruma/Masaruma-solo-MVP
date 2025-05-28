package com.example.backend.repository

import com.example.backend.model.NumberOfCards
import org.springframework.data.jpa.repository.JpaRepository

interface JPANumberOfCardsRepository : JpaRepository<NumberOfCards, Int> {
  fun findByNumberOfCard(numberOfCard: Int): NumberOfCards
}
