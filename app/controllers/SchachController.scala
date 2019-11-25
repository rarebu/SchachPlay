package controllers

import javax.inject._

import play.api.mvc._
import de.htwg.se.Schach.Schach
import de.htwg.se.Schach.controller.controllerComponent.controllerBaseImpl.GameStatus

@Singleton
class SchachController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val gameController = Schach.controller
  var previousSelectedCell:Option[(Int,Int)] = Option.empty
  def message:String = GameStatus.message(gameController.gameStatus)
  def schachAsText =  gameController.fieldToString + message

  def cellPressed(row:Int, col:Int):Action[AnyContent] = Action {
    if(previousSelectedCell.isDefined) {
      val coordinates = previousSelectedCell.get
      previousSelectedCell = Option.empty
      move(coordinates._1, coordinates._2, row, col)
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

  def move(row:Int, col:Int, newRow:Int, newCol:Int) = {
    gameController.move(row, col, newRow, newCol)
    Ok(views.html.schach(gameController, message))
  }

}