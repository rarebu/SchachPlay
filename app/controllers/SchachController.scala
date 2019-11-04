package controllers

import javax.inject._

import play.api.mvc._
import de.htwg.se.Schach.Schach
import de.htwg.se.Schach.controller.controllerComponent.controllerBaseImpl.GameStatus

@Singleton
class SchachController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val gameController = Schach.controller
  def schachAsText =  gameController.fieldToString + GameStatus.message(gameController.gameStatus)

  def about= Action {
    Ok(views.html.index())
  }

  def schach = Action {
    Ok(views.html.schach(gameController))
  }

}