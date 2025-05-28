package com.example.backend.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "game_modes") // ← 複数形に変える
data class GameMode(
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  val id: Int? = null,
//    @Column(name = "game_name",nullable = false)
  val gameName: String? = null,
)
