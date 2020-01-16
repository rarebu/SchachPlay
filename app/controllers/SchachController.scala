package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.Schach.Schach
import de.htwg.se.Schach.controller.controllerComponent.controllerBaseImpl.{CellChanged, GameStatus}
import play.api.libs.streams.ActorFlow
import akka.actor._
import akka.stream.Materializer
import play.api.i18n.I18nSupport
import utils.auth.DefaultEnv
import org.webjars.play.WebJarsUtil
import com.mohiva.play.silhouette.api.Silhouette
import com.mohiva.play.silhouette.api.actions.SecuredRequest
import scala.concurrent.Future
import scala.swing.Reactor

@Singleton
class SchachController @Inject()(
                                  components: ControllerComponents,
                                  silhouette: Silhouette[DefaultEnv]
                                )(
                                  implicit
                                  webJarsUtil: WebJarsUtil,
                                  assets: AssetsFinder,
                                  system: ActorSystem,
                                  mat: Materializer
                                ) extends AbstractController(components) with I18nSupport {
  val gameController = Schach.controller
  var previousSelectedCell: Option[(Int, Int)] = Option.empty
  def message: String = GameStatus.message(gameController.gameStatus)
  def schachAsText = gameController.fieldToString + message

  def cellPressed(row: Int, col: Int) = silhouette.SecuredAction.async {implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    if (previousSelectedCell.isDefined) {
      val coordinates = previousSelectedCell.get
      previousSelectedCell = Option.empty
      moveIntern(coordinates._1, coordinates._2, row, col)
      Future.successful(Ok(views.html.schach(gameController, message, request.identity)))
    } else {
      previousSelectedCell = Option.apply((row, col))
      Future.successful(Ok(views.html.schach(gameController, message, request.identity)))
    }
  }

  def about = Action {
    Ok(views.html.index())
  }

  def schach = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    Future.successful(Ok(views.html.schach(gameController, message, request.identity)))
  }

  def newField = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    gameController.newField
    Future.successful(Ok(views.html.schach(gameController, message, request.identity)))
  }

  private def moveIntern(row: Int, col: Int, newRow: Int, newCol: Int) = {
    gameController.move(row, col, newRow, newCol)
  }

  def move(row: Int, col: Int, newRow: Int, newCol: Int) = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    moveIntern(row, col, newRow, newCol)
    Future.successful(Ok(views.html.schach(gameController, message, request.identity)))
  }

  def pawnPromoting: Option[String] = gameController.pawnPromoting

  def getChangeableFigures: String = gameController.getChangeableFigures

  def choose(representation: String) = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    gameController.choose(representation)
    Future.successful(Ok(views.html.schach(gameController, message, request.identity)))
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

  class SchachWebSocketActor(out: ActorRef) extends Actor with Reactor {
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