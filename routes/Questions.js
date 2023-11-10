const express = require("express");
const router = express.Router();
const fs = require("fs");
const { check, validationResult } = require("express-validator");
const { Questions } = require("../models");
const { Files } = require("../models");

//Get all questions
router.get("/", async (req, res) => {
  try {
    const listofQuestions = await Questions.findAll({
      order: [["createdAt", "DESC"]],
      include: [Files],
    });
    console.log(listofQuestions);
    res.json(listofQuestions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Get a particular question
router.get("/byId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const question = await Questions.findByPk(id);

    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//edit a particular question
router.put(
  "/byId/:id",
  [
    check("questionText", "QuestionText is required").not().isEmpty(),
    check("questionType", "QuestionType is required").not().isEmpty(),
    check("options", "Options is required").not().isEmpty(),
    check("answer", "Answer is required").not().isEmpty(),
    check("marks", "Marks is required").not().isEmpty(),
    check("status", "Status is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      await Questions.update(
        {
          questionText: req.body.questionText,
          questionType: req.body.questionType,
          options: req.body.options,
          answer: req.body.answer,
          marks: req.body.marks,
          status: req.body.status,
        },
        { where: { id: req.params.id } }
      );
      //res.send(req.body);
      if (req.files !== null) {
        if (req.files.file.length) {
          for (var x = 0; x < req.files.file.length; x++) {
            var file = req.files.file[x];

            var file_name = new Date().getTime() + "_" + file.name;
            file.mv(`./client/public/uploads/${file_name}`, (err) => {
              if (err) {
                console.error(err);
                return res.status(500).send(err);
              }
            });
            await Files.create({
              FileName: file_name,
              QuestionId: req.params.id,
            });
          }
        } else {
          const file = req.files.file;
          var file_name = new Date().getTime() + "_" + file.name;
          file.mv(`./client/public/uploads/${file_name}`, (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });
          await Files.create({
            FileName: file_name,
            QuestionId: req.params.id,
          });
        }
      }
      const files = await Files.findAll({
        where: { QuestionId: req.params.id },
      });
      console.log(files);
      return res.json({ files, msg: "Question Updated Successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//delete a particular question
router.delete("/byId/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const question = await Questions.findByPk(id);

    const files = await Files.findAll({ where: { QuestionId: id } });
    await question.destroy();
    console.log(files);
    if (files) {
      for (x = 0; x < files.length; x++) {
        const fileName = files[x].FileName;
        console.log(fileName);
        const filePath = `./client/public/uploads/${fileName}`;
        fs.unlinkSync(filePath);
      }
    }
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//Upload File with express-fileuploader
router.post(
  "/upload",

  async (req, res) => {
    if (req.files === null) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    const file = req.files.file;
    file.mv(`${__dirname}/uploads/${file.name}`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
    });
  }
);

//Create a Question
router.post(
  "/",
  [
    check("questionText", "QuestionText is required").not().isEmpty(),
    check("questionType", "QuestionType is required").not().isEmpty(),
    check("options", "Options is required").not().isEmpty(),
    check("answer", "Answer is required").not().isEmpty(),
    check("marks", "Marks is required").not().isEmpty(),
    check("status", "Status is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      ClassroomId,
      questionText,
      questionType,
      options,
      answer,
      marks,
      status,
    } = req.body;

    const question = {};
    if (ClassroomId) question.ClassroomId = ClassroomId;
    if (questionText) question.questionText = questionText;
    if (questionType) question.questionType = questionType;
    if (options) question.options = options;
    if (answer) question.answer = answer;
    if (marks) question.marks = marks;
    if (status) question.status = status;
    try {
      Questions.create(question).then((x) => {
        console.log(x.id);
        var QId = x.id;
        res.json({ question, msg: "Question Created Successfully" });

        if (req.files !== null) {
          if (req.files.file.length) {
            for (var x = 0; x < req.files.file.length; x++) {
              var file = req.files.file[x];

              var file_name = new Date().getTime() + "_" + file.name;
              file.mv(`./client/public/uploads/${file_name}`, (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send(err);
                }
              });

              Files.create({
                FileName: file_name,
                QuestionId: QId,
              });
            }
          } else {
            const file = req.files.file;
            var file_name = new Date().getTime() + "_" + file.name;
            file.mv(`./client/public/uploads/${file_name}`, (err) => {
              if (err) {
                console.error(err);
                return res.status(500).send(err);
              }
            });
            Files.create({
              FileName: file_name,
              QuestionId: QId,
            });
          }
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//Get  Files by Id
router.get("/files/:id", async (req, res) => {
  try {
    const listofFiles = await Files.findAll({
      where: { QuestionId: req.params.id },
    });

    if (!listofFiles) {
      res.json({ msg: "No File Attached Yet" });
    } else {
      res.json(listofFiles);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/files/:questionId", async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const files = await Files.findAll({ where: { QuestionId: questionId } });
    console.log(files);
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/files/:filesId", async (req, res) => {
  const filesId = req.params.filesId;
  try {
    const file = await Files.findByPk(filesId);
    const fileName = file.FileName;
    console.log(file);
    console.log(fileName);

    const filePath = `./client/public/uploads/${fileName}`;
    fs.unlinkSync(filePath);
    await Files.destroy({ where: { id: filesId } });
    res.json("File Deleted Successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.put("/status/:questionId", async (req, res) => {
  const qId = req.params.questionId;

  try {
    const question = await Questions.findByPk(qId);
    const status = question.status;
    if (status == 1) {
      await Questions.update(
        {
          status: 0,
        },
        { where: { id: qId } }
      );
      res.json({ status: 0 });
    } else {
      await Questions.update(
        {
          status: 1,
        },
        { where: { id: qId } }
      );
      res.json({ status: 1 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
