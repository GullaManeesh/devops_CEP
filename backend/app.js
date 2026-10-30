
import express from "express";
import cors from "cors";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const app = express();
const PORT = process.env.PORT || 5000;

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const dataPath = path.join(currentDirectory, "data", "results.json");

app.use(cors());
app.use(express.json());

async function getStudents() {
  const fileContent = await readFile(dataPath, "utf-8");
  return JSON.parse(fileContent);
}

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Student Result Checker API is running"
  });
});

app.get("/api/results/:rollNumber", async (req, res) => {
  try {
    const students = await getStudents();

    const student = students.find(
      (item) => item.rollNumber === req.params.rollNumber
    );

    if (!student) {
      return res.status(404).json({
        message: "Student result not found"
      });
    }

    const totalMarks = student.subjects.reduce(
      (total, subject) => total + subject.marks,
      0
    );

    const maximumMarks = student.subjects.reduce(
      (total, subject) => total + subject.maxMarks,
      0
    );

    const percentage = Number(
      ((totalMarks / maximumMarks) * 100).toFixed(2)
    );

    const result = student.subjects.every(
      (subject) => subject.marks >= 35
    )
      ? "PASS"
      : "FAIL";

    return res.status(200).json({
      ...student,
      totalMarks,
      maximumMarks,
      percentage,
      result
    });
  } catch (error) {
    console.error("Error reading student results:", error);

    return res.status(500).json({
      message: "Unable to retrieve student result"
    });
  }
});

export default app;

if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  app.listen(PORT, () => {
    console.log(`Student Result Checker API running on port ${PORT}`);
  });
}
