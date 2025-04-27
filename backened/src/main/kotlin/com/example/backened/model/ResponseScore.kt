package com.example.backened.model

import java.time.Instant

data class ResponseScore(
    val id:Int?,
    var createdAt: Instant? = null,
    val gameScore: Int,
    val user: String,
)
