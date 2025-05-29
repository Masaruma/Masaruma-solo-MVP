package com.example.backend.service

import com.example.backend.model.GameLevels
import com.example.backend.model.GameMode
import com.example.backend.model.NumberOfCards
import com.example.backend.model.RequestScore
import com.example.backend.model.ResponseScore
import com.example.backend.model.Score
import com.example.backend.model.User
import com.example.backend.repository.JPAGameLevelsRepository
import com.example.backend.repository.JPAGameModeRepository
import com.example.backend.repository.JPAGameScoreRepository
import com.example.backend.repository.JPANumberOfCardsRepository
import com.example.backend.repository.JPAUserRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class GameScoreServiceTest {
  @Autowired
  private lateinit var gameScoreService: GameScoreService

  @Autowired
  private lateinit var gameScoreRepository: JPAGameScoreRepository

  @Autowired
  private lateinit var userRepository: JPAUserRepository

  @Autowired
  private lateinit var gameModeRepository: JPAGameModeRepository

  @Autowired
  private lateinit var numberOfCardsRepository: JPANumberOfCardsRepository

  @Autowired
  private lateinit var gameLevelsRepository: JPAGameLevelsRepository

  @BeforeEach
  fun setup() {
    gameScoreRepository.deleteAll()
    userRepository.deleteAll()
    gameModeRepository.deleteAll()
    numberOfCardsRepository.deleteAll()
    gameLevelsRepository.deleteAll()

    gameScoreService =
      GameScoreServiceImpl(
        gameScoreRepository,
        numberOfCardsRepository,
      )
  }

  @Test
  fun `getScoreを実行するとJPAGameScoreRepositoryを呼びScoreのListで帰ってきたデータを加工している`() {
    val modeIrasutoya =
      gameModeRepository.save(
        GameMode(gameName = "irasutoya"),
      )
    val modePokemon =
      gameModeRepository.save(
        GameMode(gameName = "pokemon"),
      )

    val numberOfCards1 =
      numberOfCardsRepository.save(
        NumberOfCards(numberOfCard = 12),
      )
    val numberOfCards2 =
      numberOfCardsRepository.save(
        NumberOfCards(numberOfCard = 20),
      )

    val level1 = gameLevelsRepository.save(GameLevels(gameLevel = "優しい"))
    val level2 = gameLevelsRepository.save(GameLevels(gameLevel = "ふつう"))

    // 2. Score を作成（irasutoyaモードのものと、別モードのもの）
    val score1 =
      Score(
        gameScore = 100,
        user = User(name = "Masaru"),
        gameMode = modeIrasutoya,
        numberOfCards = numberOfCards1,
        elapsedTimeMillis = 1000,
        missCount = 10,
        gameLevel = level1,
      )
    val score2 =
      Score(
        gameScore = 50,
        user = User(name = "Masaru2"),
        gameMode = modePokemon,
        numberOfCards = numberOfCards2,
        elapsedTimeMillis = 1000,
        missCount = 10,
        gameLevel = level2,

      )

    val saveGameScoreResult =
      gameScoreRepository.saveAll(
        listOf(score1, score2),
      )

    val savedIrasutoya = saveGameScoreResult[0]
    val expected =
      listOf(
        ResponseScore(
          id = savedIrasutoya.id,
          createdAt = savedIrasutoya.createdAt,
          gameScore = savedIrasutoya.gameScore,
          user = savedIrasutoya.user.name,
          numberOfCard = savedIrasutoya.numberOfCards.numberOfCard,
          elapsedTimeMillis = savedIrasutoya.elapsedTimeMillis,
          missCount = savedIrasutoya.missCount,
        ),
      )

    val testResult = gameScoreService.getScore(1, 12, 1)

    assertEquals(expected, testResult)
  }

  @Test
  fun`postScoreを実行するとJPAGameScoreRepositoryを呼びデータが保存される`() {
    val modeIrasutoya =
      gameModeRepository.save(
        GameMode(gameName = "irasutoya"),
      )

//    gameModeRepository.save(GameMode(gameName = "irasutoya"))
    gameModeRepository.save(GameMode(gameName = "pokemon"))
    numberOfCardsRepository.save(NumberOfCards(numberOfCard = 12))
    val level1 = gameLevelsRepository.save(GameLevels(gameLevel = "優しい"))

    val saveAndExpectedData =
      RequestScore(
        user = "masaru",
        gameScore = 300,
        gameModeId = modeIrasutoya.id!!,
        numberOfCard = "12",
        elapsedTimeMillis = 1000,
        missCount = 10,
        gameLevelId = level1.id!!,
      )

    gameScoreService.postScore(saveAndExpectedData)

    val actualResult = gameScoreRepository.findAll().first()

    assertEquals(saveAndExpectedData.user, actualResult.user.name)
    assertEquals(saveAndExpectedData.gameScore, actualResult.gameScore)
    assertEquals(saveAndExpectedData.gameScore, actualResult.gameScore)
    assertEquals(
      saveAndExpectedData.elapsedTimeMillis,
      actualResult.elapsedTimeMillis,
    )
    assertEquals(saveAndExpectedData.missCount, actualResult.missCount)
    assertEquals(
      saveAndExpectedData.gameModeId,
      actualResult.gameMode.id,
    )
    assertEquals(
      saveAndExpectedData.numberOfCard.toInt(),
      actualResult.numberOfCards.numberOfCard,
    )

    assertEquals(saveAndExpectedData.gameLevelId, actualResult.gameLevel.id)
  }
}
