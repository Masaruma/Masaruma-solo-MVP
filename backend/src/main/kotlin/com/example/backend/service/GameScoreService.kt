package com.example.backend.service

import com.example.backend.model.GameLevels
import com.example.backend.model.GameMode
import com.example.backend.model.RequestScore
import com.example.backend.model.ResponseScore
import com.example.backend.model.Score
import com.example.backend.model.User
import com.example.backend.repository.JPAGameScoreRepository
import com.example.backend.repository.JPANumberOfCardsRepository
import org.springframework.stereotype.Service

interface GameScoreService {
  fun getScore(
    gameModeId: Int,
    numberOfCard: Int,
    gameLevelId: Int,
  ): List<ResponseScore>

  fun postScore(requestData: RequestScore)
}

@Service
class GameScoreServiceImpl(
  val gameScoreRepository: JPAGameScoreRepository,
  val numberOfCardsRepository: JPANumberOfCardsRepository,
) : GameScoreService {
  override fun getScore(
    gameModeId: Int,
    numberOfCard: Int,
    gameLevelId: Int,
  ): List<ResponseScore> {
//        todo gameLevelでもsocreリポジトリを取得する必要がある

    val getResult =
      gameScoreRepository.findByGameModeIdAndGameLevelIdAndNumberOfCardsNumberOfCard(
        gameModeId,
        gameLevelId,
        numberOfCard,
      )

    val scoreEntityToResponseScore =
      getResult.map {
        ResponseScore(
          id = it.id,
          createdAt = it.createdAt,
          gameScore = it.gameScore,
          numberOfCard = it.numberOfCards.numberOfCard,
          elapsedTimeMillis = it.elapsedTimeMillis,
          missCount = it.missCount,
          user = it.user.name,
        )
      }.sortedBy { it.gameScore }
        .take(10)

    return scoreEntityToResponseScore
  }

  override fun postScore(requestData: RequestScore) {
    val nowGameLevel =
      numberOfCardsRepository.findByNumberOfCard(
        requestData.numberOfCard.toInt(),
      )
    gameScoreRepository.save(
      Score(
        gameScore = requestData.gameScore,
        user = User(name = requestData.user),
        gameMode = GameMode(id = requestData.gameModeId),
        numberOfCards = nowGameLevel,
        elapsedTimeMillis = requestData.elapsedTimeMillis,
        missCount = requestData.missCount,
        gameLevel = GameLevels(id = requestData.gameLevelId),
      ),
    )
  }
}
