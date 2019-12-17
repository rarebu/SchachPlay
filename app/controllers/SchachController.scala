package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.Schach.Schach
import de.htwg.se.Schach.controller.controllerComponent.controllerBaseImpl.{CellChanged, GameStatus}
import play.api.libs.streams.ActorFlow
import akka.actor._
import akka.stream.Materializer

import scala.swing.Reactor

@Singleton
class SchachController @Inject()(cc: ControllerComponents) (implicit system: ActorSystem, mat: Materializer) extends AbstractController(cc) {
  val gameController = Schach.controller
  var previousSelectedCell:Option[(Int,Int)] = Option.empty
  def message:String = GameStatus.message(gameController.gameStatus)
  def schachAsText =  gameController.fieldToString + message

  def cellPressed(row:Int, col:Int):Action[AnyContent] = Action {
    if(previousSelectedCell.isDefined) {
      val coordinates = previousSelectedCell.get
      previousSelectedCell = Option.empty
      moveIntern(coordinates._1, coordinates._2, row, col)
    } else {
      previousSelectedCell = Option.apply((row, col))
      Ok(views.html.schach(gameController, message))
    }
  }

  def about= Action {
    Ok(views.html.index())
  }

  def schach = Action {
    Ok(views.html.schach(gameController, message))
  }

  def newField = Action {
    gameController.newField
    Ok(views.html.schach(gameController, message))
  }

  private def moveIntern(row:Int, col:Int, newRow:Int, newCol:Int) = {
    gameController.move(row, col, newRow, newCol)
    Ok(views.html.schach(gameController, message))
  }

  def move(row:Int, col:Int, newRow:Int, newCol:Int) = Action {
    moveIntern(row, col, newRow, newCol)
  }

  def pawnPromoting:Option[String] = gameController.pawnPromoting

  def getChangeableFigures:String = gameController.getChangeableFigures

  def choose(representation:String) = Action {
    gameController.choose(representation)
    Ok(views.html.schach(gameController, message))
  }

  def fieldToJson = Action {
    Ok(gameController.toJson)
  }

  def socket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      println("Connect received")
      SchachWebSocketFactory.create(out)
    }
  }

  object SchachWebSocketFactory {
    def create(out: ActorRef) = {
      Props(new SchachWebSocketActor(out))
    }
  }

  class SchachWebSocketActor(out: ActorRef) extends Actor with Reactor{
    listenTo(gameController)

    override def receive = {
      case msg: String =>
        out ! (gameController.toJson.toString())
        println("Sent Json to Client" + msg)
    }

    reactions += {
      case event: CellChanged => sendJsonToClient
    }

    def sendJsonToClient = {
      println("Received event from Controller")
      out ! (gameController.toJson.toString())
    }
  }

}