package com.example.backened.repository

import com.example.backened.model.GameMode
import com.example.backened.model.Score
import com.example.backened.model.User
import org.springframework.data.jpa.repository.JpaRepository

interface JPAGameModeRepository: JpaRepository<GameMode, Int> {

}
