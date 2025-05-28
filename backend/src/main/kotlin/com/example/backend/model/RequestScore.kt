package com.example.backend.model

data class RequestScore(
  val id: Int? = null,
  val gameScore: Int,
  val elapsedTimeMillis: Int,
  val missCount: Int,
  val numberOfCard: String,
  val gameModeId: Int,
  val user: String,
)
