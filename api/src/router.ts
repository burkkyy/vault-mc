import path from "path"
import fs from "fs"

import { Router, type Request, type Response, ErrorRequestHandler, NextFunction } from "express"
import { UnauthorizedError } from "express-jwt"
import { template } from "lodash"

import { APPLICATION_NAME, GIT_COMMIT_HASH, NODE_ENV, RELEASE_TAG } from "@/config"
import migrator from "@/db/migrator"

import {
  jwtMiddleware,
  ensureAndAuthorizeCurrentUser,
  bodyAuthorizationHoistMiddleware,
} from "@/middlewares"

import {
  Assessments,
  AssessmentsController,
  ClientsController,
  ClientUsersController,
  CurrentUserController,
  AssessmentMeasureValidationsController,
  AssessmentMeasuresController,
  EnergyConservationMeasureValidationsController,
  EnergyConservationMeasuresController,
  Facilities,
  FacilitiesController,
  FacilityCategoriesController,
  FacilityUtilitiesController,
  PortfoliosController,
  ReportTemplates,
  ReportTemplatesController,
  StatisticsController,
  UsersController,
  UtilityElectricityMonthliesController,
  UtilityEnergySourcesController,
  UtilityGenericMonthliesController,
} from "@/controllers"

import { logger } from "@/utils/logger"

export const router = Router()

// non-api (no authentication is required) routes
router.route("/_status").get((_req: Request, res: Response) => {
  res.json({
    RELEASE_TAG,
    GIT_COMMIT_HASH,
  })
})

// api routes
// Add all the standard api controller routes here
router.use("/api", bodyAuthorizationHoistMiddleware, jwtMiddleware, ensureAndAuthorizeCurrentUser)
router.use("/migrate", migrator.migrationRouter)

// Users
router.route("/api/current-user").get(CurrentUserController.show)
router.route("/api/users").get(UsersController.index).post(UsersController.create)
router
  .route("/api/users/:userId")
  .get(UsersController.show)
  .patch(UsersController.update)
  .delete(UsersController.destroy)

// Assessments
router.route("/api/assessments").get(AssessmentsController.index).post(AssessmentsController.create)
router
  .route("/api/assessments/:assessmentId")
  .get(AssessmentsController.show)
  .patch(AssessmentsController.update)
  .delete(AssessmentsController.destroy)
router
  .route("/api/assessments/:assessmentId/bulk-upsert-statistics.csv")
  .post(Assessments.BulkUpsertStatisticsController.create)
router
  .route("/api/assessments/:assessmentId/ensure-report.docx")
  .post(Assessments.EnsureReportController.create)
router
  .route("/api/assessments/:assessmentId/data")
  .get(Assessments.DataController.show)
  .patch(Assessments.DataController.update)
router.route("/api/assessments/:assessmentId/reports").patch(Assessments.ReportsController.update)

// Clients
router.route("/api/clients").get(ClientsController.index).post(ClientsController.create)
router
  .route("/api/clients/:clientId")
  .get(ClientsController.show)
  .patch(ClientsController.update)
  .delete(ClientsController.destroy)

// Client Users
router
  .route("/api/client-users")
  .get(ClientUsersController.index)
  .post(ClientUsersController.create)
router
  .route("/api/client-users/:clientUserId")
  .get(ClientUsersController.show)
  .patch(ClientUsersController.update)
  .delete(ClientUsersController.destroy)

// Portfolios
router.route("/api/portfolios").get(PortfoliosController.index).post(PortfoliosController.create)
router
  .route("/api/portfolios/:portfolioId")
  .get(PortfoliosController.show)
  .patch(PortfoliosController.update)
  .delete(PortfoliosController.destroy)

// Report Templates
router
  .route("/api/report-templates")
  .get(ReportTemplatesController.index)
  .post(ReportTemplatesController.create)
router
  .route("/api/report-templates/:reportTemplateId")
  .get(ReportTemplatesController.show)
  .delete(ReportTemplatesController.destroy)
router
  .route("/api/report-templates/:reportTemplateId/download")
  .get(ReportTemplates.DownloadController.show)

// Energy Conservation Measures
router
  .route("/api/energy-conservation-measures")
  .get(EnergyConservationMeasuresController.index)
  .post(EnergyConservationMeasuresController.create)
router
  .route("/api/energy-conservation-measures/:energyConservationMeasureId")
  .get(EnergyConservationMeasuresController.show)
  .patch(EnergyConservationMeasuresController.update)
  .delete(EnergyConservationMeasuresController.destroy)

// Energy Conservation Measure Validations
router
  .route("/api/energy-conservation-measure-validations")
  .get(EnergyConservationMeasureValidationsController.index)
  .post(EnergyConservationMeasureValidationsController.create)
router
  .route(
    "/api/energy-conservation-measure-validations/:energyConservationMeasureValidationId"
  )
  .get(EnergyConservationMeasureValidationsController.show)
  .patch(EnergyConservationMeasureValidationsController.update)
  .delete(EnergyConservationMeasureValidationsController.destroy)

// Assessment Measures
router
  .route("/api/assessment-measures")
  .get(AssessmentMeasuresController.index)
  .post(AssessmentMeasuresController.create)
router
  .route("/api/assessment-measures/:assessmentMeasureId")
  .get(AssessmentMeasuresController.show)
  .patch(AssessmentMeasuresController.update)
  .delete(AssessmentMeasuresController.destroy)

// Assessment Measure Validations
router
  .route("/api/assessment-measure-validations")
  .get(AssessmentMeasureValidationsController.index)
  .post(AssessmentMeasureValidationsController.create)
router
  .route("/api/assessment-measure-validations/:assessmentMeasureValidationId")
  .get(AssessmentMeasureValidationsController.show)
  .patch(AssessmentMeasureValidationsController.update)
  .delete(AssessmentMeasureValidationsController.destroy)

// Facilities
router.route("/api/facilities").get(FacilitiesController.index).post(FacilitiesController.create)
router
  .route("/api/facilities/:facilityId")
  .get(FacilitiesController.show)
  .patch(FacilitiesController.update)
  .delete(FacilitiesController.destroy)

router
  .route("/api/facilities/:facilityId/assessments")
  .post(Facilities.AssessmentsController.create)

router
  .route("/api/facilities/:facilityId/report-templates/tags.csv")
  .post(Facilities.GenerateReportController.show)
router
  .route("/api/facilities/:facilityId/report-templates/:reportTemplateId/generate.docx")
  .post(Facilities.GenerateReportController.create)
router
  .route("/api/facilities/:facilityId/utility-analysis")
  .post(Facilities.UtilityAnalysisController.create)

// Facility Categories
router
  .route("/api/facility-categories")
  .get(FacilityCategoriesController.index)
  .post(FacilityCategoriesController.create)
router
  .route("/api/facility-categories/:facilityCategoryId")
  .get(FacilityCategoriesController.show)
  .patch(FacilityCategoriesController.update)
  .delete(FacilityCategoriesController.destroy)

// Facility Utilities
router
  .route("/api/facility-utilities")
  .get(FacilityUtilitiesController.index)
  .post(FacilityUtilitiesController.create)
router
  .route("/api/facility-utilities/:facilityUtilityId")
  .get(FacilityUtilitiesController.show)
  .patch(FacilityUtilitiesController.update)
  .delete(FacilityUtilitiesController.destroy)

// Statistics
router.route("/api/statistics").get(StatisticsController.index).post(StatisticsController.create)
router
  .route("/api/statistics/:statisticId")
  .get(StatisticsController.show)
  .patch(StatisticsController.update)
  .delete(StatisticsController.destroy)

// Utility Electricity Monthlies
router
  .route("/api/utility-electricity-monthlies")
  .get(UtilityElectricityMonthliesController.index)
  .post(UtilityElectricityMonthliesController.create)
router
  .route("/api/utility-electricity-monthlies/:utilityElectricityMonthlyId")
  .get(UtilityElectricityMonthliesController.show)
  .patch(UtilityElectricityMonthliesController.update)
  .delete(UtilityElectricityMonthliesController.destroy)

// Utility Energy Sources
router
  .route("/api/utility-energy-sources")
  .get(UtilityEnergySourcesController.index)
  .post(UtilityEnergySourcesController.create)
router
  .route("/api/utility-energy-sources/:utilityEnergySourceId")
  .get(UtilityEnergySourcesController.show)
  .patch(UtilityEnergySourcesController.update)
  .delete(UtilityEnergySourcesController.destroy)

// Utility Generic Monthlies
router
  .route("/api/utility-generic-monthlies")
  .get(UtilityGenericMonthliesController.index)
  .post(UtilityGenericMonthliesController.create)
router
  .route("/api/utility-generic-monthlies/:utilityGenericMonthlyId")
  .get(UtilityGenericMonthliesController.show)
  .patch(UtilityGenericMonthliesController.update)
  .delete(UtilityGenericMonthliesController.destroy)

// if no other routes match, return a 404
router.use("/api", (_req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" })
})

// Special error handler for all api errors
// See https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
router.use("/api", (err: ErrorRequestHandler, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err)
  } else if (err instanceof UnauthorizedError) {
    logger.error(err)
    res.status(err.status).json({ message: err.inner.message })
  } else {
    logger.error(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// if no other non-api routes match, send the pretty 404 page
if (NODE_ENV == "development") {
  router.use("/", (_req: Request, res: Response) => {
    const templatePath = path.resolve(__dirname, "web/404.html")
    try {
      const templateString = fs.readFileSync(templatePath, "utf8")
      const compiledTemplate = template(templateString)
      const result = compiledTemplate({
        applicationName: APPLICATION_NAME,
        releaseTag: RELEASE_TAG,
        gitCommitHash: GIT_COMMIT_HASH,
      })
      res.status(404).send(result)
    } catch (error) {
      logger.error(error)
      res.status(500).send(`Error building 404 page: ${error}`)
    }
  })
}

export default router
