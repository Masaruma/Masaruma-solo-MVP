package com.example.backend.model

import java.time.Instant

data class ResponseScore(
  val id: Int?,
  var createdAt: Instant? = null,
  val gameScore: Int,
  val elapsedTimeMillis: Int,
  val missCount: Int,
  val gameLevel: Int,
  val user: String,
)
