package com.example.backend.model

data class RequestScore(
  val id: Int? = null,
  val gameScore: Int,
  val elapsedTimeMillis: Int,
  val missCount: Int,
  val numberOfCard: String,
  val gameMode: String,
  val user: String,
)
