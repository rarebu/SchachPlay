package controllers

import com.mohiva.play.silhouette.api.actions.SecuredRequest
import com.mohiva.play.silhouette.api.{LogoutEvent, Silhouette}
import javax.inject.Inject
import org.webjars.play.WebJarsUtil
import play.api.i18n.I18nSupport
import play.api.mvc._
import utils.auth.DefaultEnv
import utils.route.Calls

import scala.concurrent.Future

/**
 * The basic application controller.
 */
class ApplicationController @Inject()(
                                       components: ControllerComponents,
                                       silhouette: Silhouette[DefaultEnv]
                                     )(
                                       implicit
                                       webJarsUtil: WebJarsUtil,
                                       assets: AssetsFinder
                                     ) extends AbstractController(components) with I18nSupport {

  /**
   * Handles the home action.
   *
   * @return The result to display.
   */
  def index = silhouette.UnsecuredAction.async { implicit request: Request[AnyContent] =>
    Future.successful(Ok(views.html.home()))
  }

  /**
   * Handles the Sign Out action.
   *
   * @return The result to display.
   */
  def signOut = silhouette.SecuredAction.async { implicit request: SecuredRequest[DefaultEnv, AnyContent] =>
    val result = Redirect(Calls.home)
    silhouette.env.eventBus.publish(LogoutEvent(request.identity, request))
    silhouette.env.authenticatorService.discard(request.authenticator, result)
  }
}
