package com.example.backend.model

import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.Instant

@Entity
@EntityListeners(AuditingEntityListener::class) // ← 追加
@Table(name = "score")
data class Score(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  val id: Int? = null,
  val gameScore: Int,
  val elapsedTimeMillis: Int,
  val missCount: Int,
  @CreatedDate
  var createdAt: Instant? = null,
  @LastModifiedDate
  var updatedAt: Instant? = null,
  @ManyToOne(cascade = [CascadeType.PERSIST])
  @JoinColumn(name = "user_id")
  val user: User,
  @ManyToOne
  @JoinColumn(name = "game_mode_id")
  val gameMode: GameMode,
  @ManyToOne
  @JoinColumn(name = "number_of_cards_id")
  val numberOfCards: NumberOfCards,
)
