import { Router } from "express";
import {
  createMentor,
  createStudent,
  mentorInfo,
  studentInfo,
  unassignedStudents,
  assignStudentToMentor,
  changeMentor,
  mentorStudents,
  deleteStudent,
  deletementor,
} from "../controllers/studentMentorMangement.js";

const router = Router();

router.post("/create-mentor", createMentor);
router.post("/create-student", createStudent);
router.get("/get-students-info", studentInfo);
router.get("/get-mentors-info", mentorInfo);
router.get("/get-unassigned-students", unassignedStudents);
router.put("/assign-student-to-mentor/:mentorId", assignStudentToMentor);
router.put("/change-mentor/:studentId", changeMentor);
router.get("/mentor-students/:mentorId", mentorStudents);
router.delete("/delete-student/:studentId", deleteStudent);
router.delete("/delete-mentor/:mentorId", deletementor);

export default router;
