package com.example.backened.model

import java.time.Instant

data class RequestScore(
    val id: Int?= null,
    val gameScore: Int,
    val gameMode: String,
    val user: String,
)
