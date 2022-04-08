import { Router } from "express";
import {
  createMentor,
  createStudent,
  mentorInfo,
  studentInfo,
  unassignedStudents,
  assignStudentToMentor
} from "../controllers/studentMentorMangement.js";

const router = Router();

router.post("/create-mentor", createMentor);
router.post("/create-student", createStudent);
router.get("/get-students-info", studentInfo);
router.get("/get-mentors-info", mentorInfo);
router.get("/get-unassigned-students", unassignedStudents);
router.put("/assign-student-to-mentor/:mentorId", assignStudentToMentor);

export default router;
