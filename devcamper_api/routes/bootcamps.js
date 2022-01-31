const express = require("express");
const router = express.Router();

const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/Bootcamp");
const advancedResult = require("../middleware/advancedResult");

// Include other resoure routers
const courseRouter = require("./courses");

const { protect, authorize } = require("../middleware/auth");

// Re-route into other resoure routers
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResult(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp);

module.exports = router;
