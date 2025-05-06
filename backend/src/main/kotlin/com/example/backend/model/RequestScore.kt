package com.example.backend.model

data class RequestScore(
  val id: Int? = null,
  val gameScore: Int,
  val gameLevel: String,
  val gameMode: String,
  val user: String,
)
