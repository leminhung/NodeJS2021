const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
  addCourse,
} = require("../controllers/courses");

const Course = require("../models/Course");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, authorize("publisher", "admin"), addCourse);

router
  .route("/:id")
  .get(getCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse);

module.exports = router;
