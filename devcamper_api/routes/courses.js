const express = require("express");
const router = express.Router({ mergeParams: true });
const Course = require("../models/Course");
const advancedResult = require("../middleware/advancedResult");

const {
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
  addCourse,
} = require("../controllers/courses");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResult(Course, {
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
