package com.example.backened.service

import com.example.backened.model.GameMode
import com.example.backened.model.RequestScore
import com.example.backened.model.ResponseScore
import com.example.backened.model.Score
import com.example.backened.model.User
import com.example.backened.repository.JPAGameModeRepository
import com.example.backened.repository.JPAGameScoreRepository
import org.springframework.stereotype.Service

interface GameScoreService {
    fun getScore(mode: String): List<ResponseScore>
    fun postScore(requestData: RequestScore)
}

@Service
class GameScoreServiceImpl(
    val gameScoreRepository: JPAGameScoreRepository,
    val gameModeRepository: JPAGameModeRepository
) : GameScoreService {
    override fun getScore(mode: String): List<ResponseScore> {
        var getResult = gameScoreRepository.findByGameModeGameName(mode)
        val scoreToResponseScore =
            getResult.map { ResponseScore(it.id, it.createdAt, it.gameScore, it.user.name) }

        return scoreToResponseScore
    }

    override fun postScore(requestData: RequestScore) {
        val nowGameMode = gameModeRepository.findByGameName(requestData.gameMode)
        gameScoreRepository.save(
            Score(
                gameScore = requestData.gameScore,
                user = User(name = requestData.user),
                gameMode = nowGameMode
            )
        )
    }
}