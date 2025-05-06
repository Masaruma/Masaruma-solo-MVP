package com.example.backend.service

import com.example.backend.model.GameLevel
import com.example.backend.model.GameMode
import com.example.backend.model.RequestScore
import com.example.backend.model.ResponseScore
import com.example.backend.model.Score
import com.example.backend.model.User
import com.example.backend.repository.JPAGameLevelRepository
import com.example.backend.repository.JPAGameModeRepository
import com.example.backend.repository.JPAGameScoreRepository
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
  private lateinit var gameLevelRepository: JPAGameLevelRepository

  @BeforeEach
  fun setup() {
    gameScoreRepository.deleteAll()
    userRepository.deleteAll()
    gameModeRepository.deleteAll()
    gameLevelRepository.deleteAll()
    gameScoreService =
      GameScoreServiceImpl(
        gameScoreRepository,
        gameModeRepository,
        gameLevelRepository,
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

    val gameLevel1 = gameLevelRepository.save(GameLevel(level = 12))
    val gameLevel2 = gameLevelRepository.save(GameLevel(level = 20))

    // 2. Score を作成（irasutoyaモードのものと、別モードのもの）
    val score1 =
      Score(
        gameScore = 100,
        user = User(name = "Masaru"),
        gameMode = modeIrasutoya,
        gameLevel = gameLevel1,
      )
    val score2 =
      Score(
        gameScore = 50,
        user = User(name = "Masaru2"),
        gameMode = modePokemon,
        gameLevel = gameLevel2,
      )
    val score3 =
      Score(
        gameScore = 50,
        user = User(name = "Masaru3"),
        gameMode = modePokemon,
        gameLevel = gameLevel1,
      )

    val saveGameScoreResult =
      gameScoreRepository.saveAll(
        listOf(score1, score2, score3),
      )
    val irasutoya = saveGameScoreResult[0]
    val expected =
      listOf(
        ResponseScore(
          id = irasutoya.id,
          createdAt = irasutoya.createdAt,
          gameScore = irasutoya.gameScore,
          user = irasutoya.user.name,
          gameLevel = irasutoya.gameLevel.level,
        ),
      )

    val testResult = gameScoreService.getScore("irasutoya", 12)

    assertEquals(expected, testResult)
  }

  @Test
  fun`postScoreを実行するとJPAGameScoreRepositoryを呼びデータが保存される`() {
    gameModeRepository.save(GameMode(gameName = "irasutoya"))
    gameModeRepository.save(GameMode(gameName = "pokemon"))
    gameLevelRepository.save(GameLevel(level = 12))

    val saveAndExpectedData =
      RequestScore(
        user = "masaru",
        gameScore = 300,
        gameMode = "irasutoya",
        gameLevel = "12",
      )

    gameScoreService.postScore(saveAndExpectedData)

    val actualResult = gameScoreRepository.findAll().first()

    assertEquals(saveAndExpectedData.user, actualResult.user.name)
    assertEquals(saveAndExpectedData.gameScore, actualResult.gameScore)
    assertEquals(
      saveAndExpectedData.gameMode,
      actualResult.gameMode.gameName,
    )
    assertEquals(
      saveAndExpectedData.gameLevel.toInt(),
      actualResult.gameLevel.level,
    )
  }
}
