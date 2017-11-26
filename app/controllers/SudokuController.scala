package controllers

import javax.inject._

import play.api.mvc._
import de.htwg.se.sudoku.Sudoku
import de.htwg.se.sudoku.controller.controllerComponent.GameStatus
import play.api.libs.streams.ActorFlow
import akka.actor.ActorSystem
import akka.stream.Materializer
import akka.actor._



@Singleton
class SudokuController @Inject()(cc: ControllerComponents) (implicit system: ActorSystem, mat: Materializer) extends AbstractController(cc) {
  val gameController = Sudoku.controller
  def message = GameStatus.message(gameController.gameStatus)
  def sudokuAsText =  gameController.gridToString + message

  def about= Action {
    Ok(views.html.index())
  }

  def sudoku = Action {
    Ok(views.html.sudoku(gameController, message))
  }

  def newGrid = Action {
    gameController.createNewGrid
    Ok(views.html.sudoku(gameController, message))
  }

  def solve = Action {
    gameController.solve
    Ok(views.html.sudoku(gameController, message))
  }

  def highlight(index:Int)= Action {
    gameController.highlight(index)
    Ok(views.html.sudoku(gameController, message))
  }

  def resize(size:Int)= Action {
    gameController.resize(size)
    Ok(views.html.sudoku(gameController, message))
  }

  def set(row:Int, col:Int, value:Int)= Action {
    gameController.set(row,col, value)
    Ok(views.html.sudoku(gameController, message))
  }

  def showCandidates(row:Int, col:Int)= Action {
    gameController.showCandidates(row,col)
    Ok(views.html.sudoku(gameController, message))
  }

  def gridToJson = Action {
    Ok(gameController.toJson)
  }

  def socket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      println("Connect received")
      MyWebSocketActor.props(out)
    }
  }

  object MyWebSocketActor {
    def props(out: ActorRef) = {
      println("Object created")
      Props(new MyWebSocketActor(out))
    }
  }

  class MyWebSocketActor(out: ActorRef) extends Actor {
    println("Class created")
    def receive = {
      case msg: String =>
        out ! ("I received your message: " + msg)
        println("Received message "+ msg)
    }
  }
}