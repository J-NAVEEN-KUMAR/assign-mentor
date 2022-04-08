import Mentor from "../models/mentor.js";
import Student from "../models/student.js";

//Mentor creation
export const createMentor = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, phone, technology } = req.body;

    //validation
    if (!name)
      return res
        .status(400)
        .send("Name field is required, Please provide name and proceed!");
    if (!email)
      return res
        .status(400)
        .send("Email field is required, Please provide email and proceed!");
    if (!phone)
      return res
        .status(400)
        .send(
          "Phone field is required, Please provide phone number and proceed!"
        );

    // email must be unique
    let userExist = await Mentor.findOne({ email }).exec();
    if (userExist)
      return res
        .status(400)
        .send(
          "It seems the user with this email already exists! Please check."
        );
    let userPhone = await Student.findOne({ phone }).exec();
    if (userPhone)
      return res
        .status(400)
        .send(
          "It seems the user with this phone number already exists! Please check."
        );

    // Mentor Creation
    const mentor = new Mentor(req.body);
    await mentor.save();
    console.log("MENTOR CREATED", mentor);
    return res.json({ ok: true, mentor });
  } catch (error) {
    console.log("MENTOR CREATION FAILED", error);
    return res.status(400).send("Error in Mentor creation. Try again!");
  }
};

//Student Creation
export const createStudent = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, phone, course } = req.body;

    //validation
    if (!name)
      return res
        .status(400)
        .send("Name field is required, Please provide name and proceed!");
    if (!email)
      return res
        .status(400)
        .send("Email field is required, Please provide email and proceed!");
    if (!phone)
      return res
        .status(400)
        .send(
          "Phone field is required, Please provide phone number and proceed!"
        );

    // email must be unique
    let userExist = await Student.findOne({ email }).exec();
    if (userExist)
      return res
        .status(400)
        .send(
          "It seems the user with this email already exists! Please check."
        );
    let userPhone = await Student.findOne({ phone }).exec();
    if (userPhone)
      return res
        .status(400)
        .send(
          "It seems the user with this phone number already exists! Please check."
        );

    // Student Creation
    const student = new Student(req.body);
    await student.save();
    console.log("STUDENT CREATED", student);
    return res.json({ ok: true, student });
  } catch (error) {
    console.log("STUDENT CREATION FAILED", error);
    return res.status(400).send("Error in Student creation. Try again!");
  }
};

//getting student info
export const studentInfo = async (req, res) => {
  try {
    let all = await Student.find({}).exec();
    res.json(all);
  } catch (error) {
    console.log("ERROR GETTING STUDENT INFO", error);
    return res.status(400).send("Error getting in Student info");
  }
};

//getting mentor info
export const mentorInfo = async (req, res) => {
  try {
    let all = await Mentor.find({}).exec();
    res.json(all);
  } catch (error) {
    console.log("ERROR GETTING MENTOR INFO", error);
    return res.status(400).send("Error getting in Mentor info");
  }
};

//getting unassigned students
export const unassignedStudents = async (req, res) => {
  try {
    let unassignedStudents = await Student.find({
      mentorAssigned: { $eq: null },
    }).exec();
    res.json(unassignedStudents);
  } catch (error) {
    console.log("ERROR GETTING UNASSIGNED STUDENTS INFO", error);
    return res.status(400).send("Error getting in unassigned students info");
  }
};

//assigning student to a mentor
export const assignStudentToMentor = async (req, res) => {
  try {
    let studentsArray = req.body.studentsAssigned;
    console.log(studentsArray);
    let mentorStudents = await Mentor.findById(req.params.mentorId);
    mentorStudents = mentorStudents.studentsAssigned;
    // console.log(mentorStudents);
    studentsArray.forEach(async (s) => {
      let student = await Student.findById(s);
      // console.log(student.mentorAssigned);
      if (!student.mentorAssigned) {
        let assignedStudent = await Student.findByIdAndUpdate(
          s,
          {
            $set: { mentorAssigned: req.params.mentorId },
          },
          {
            new: true,
          }
        ).exec();
        // console.log("STUDENTS ==>",assignedStudent);
        console.log("S ===>", s);
        mentorStudents.push(s);
        console.log(mentorStudents);
      }
      let mentor = await Mentor.findByIdAndUpdate(
        req.params.mentorId,
        { $set: { studentsAssigned: mentorStudents } },
        {
          new: true,
        }
      ).exec();
    });
    // console.log("MENTOR ===>",mentor);
    res.status(200).json("Students assigned successfully!");
  } catch (error) {
    console.log("ERROR ASSIGNING STUDENT TO MENTOR", error);
    return res.status(400).send("Error assigining student to mentor");
  }
};

//change mentor for a student
export const changeMentor = async (req, res) => {
  const studentId = req.params.studentId;
  const mentorId = req.body.mentorAssigned;
  const { mentorAssigned } = await Student.findById(req.params.studentId);
  const currentMentorId = mentorAssigned.toString();

  console.log("STUDENT_ID ===>", studentId);
  console.log("MENTOR_ID ===>", mentorId);
  console.log("CURRENT_MENTOR_ID ===>", currentMentorId);

  if (currentMentorId === mentorId) {
    return res.status(200).json("Assigned mentor is same for this student");
  } else {
    // updating student db
    let student = await Student.findByIdAndUpdate(
      studentId,
      { $set: { mentorAssigned: mentorId } },
      { new: true }
    ).exec();

    //updating mentor db
    const { studentsAssigned } = await Mentor.findById(mentorId);
    let studentsArray = studentsAssigned;
    studentsArray.push(studentId);
    await Mentor.findByIdAndUpdate(
      mentorId,
      { $set: { studentsAssigned: studentsArray } },
      { new: true }
    ).exec();

    //updating current mentor db
    const id = await Mentor.findById(currentMentorId);
    let currentMentorsStudentArray = id.studentsAssigned;
    let index = currentMentorsStudentArray.indexOf(studentId);
    currentMentorsStudentArray.splice(index, 1);
    await Mentor.findByIdAndUpdate(
      currentMentorId,
      {
        $set: { studentsAssigned: currentMentorsStudentArray },
      },
      { new: true }
    ).exec();
    res.status(200).json(student);
  }
};

//getting students for a mentor
export const mentorStudents = async (req, res) => {
  const mentorId = req.params.mentorId;
  const { studentsAssigned } = await Mentor.findById(mentorId).exec();
  // console.log(studentsAssigned);
  let studentNames = [];
  studentsAssigned.forEach(async (s) => {
    const { name } = await Student.findById(s).exec();
    studentNames.push(name);
    // console.log(studentNames);
  });
  setTimeout(() => {
    res.status(200).json(studentNames);
  }, 1000);
};
