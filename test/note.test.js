import chai from "chai";
import chaiHttp from "chai-http";
import app from "../script.js";
import { loggedInUserToken } from "./auth.test.js";

const should = chai.should();

chai.use(chaiHttp);

let createdNoteId;
let createdTagId;
let tagIds = [];
let createdWorkspaceId;
let invalidNoteId = "54e4ce16ef0bdff95d46f072";

describe("Notes Routes", function () {
    it("should create a new workspace", function (done) {
		chai
			.request(app)
			.post("/api/workspace/add-workspace/")
            .set('Authorization', `Bearer ${loggedInUserToken}`)
			.send({ name: "Test Workspace" })
			.end((err, res) => {
				if (err) {
					console.error(err);
					done(err);
				} else {
					console.log(res.body);
					createdWorkspaceId = res.body.newWorkspace._id;
					console.log(createdWorkspaceId);
					res.should.have.status(200);
					done();
				}
			});
	}).timeout(5000);
    it("should create a new tag", function (done) {
        chai
          .request(app)
          .post("/api/tags/add-tag/")
          .set('Authorization', `Bearer ${loggedInUserToken}`)
          .send({ name: "Test Tag 1" })
          .end((err, res) => {
            if (err) {
              console.error(err);
              done(err);
            } else {
              console.log(res.body); 
              createdTagId = res.body.newTag._id;
              tagIds.push(createdTagId)
              res.should.have.status(200);
              done();
            }
          });
      }).timeout(20000);
      it("should create a new tag", function (done) {
        chai
          .request(app)
          .post("/api/tags/add-tag/")
          .set('Authorization', `Bearer ${loggedInUserToken}`)
          .send({ name: "Test Tag 2" })
          .end((err, res) => {
            if (err) {
              console.error(err);
              done(err);
            } else {
              console.log(res.body); 
              createdTagId = res.body.newTag._id;
              tagIds.push(createdTagId)
              res.should.have.status(200);
              done();
            }
          });
      }).timeout(20000);
      let testNote = {
        title: "Test Note",
        answers: ["Test Answer 1","Test Answer 2","Test Answer 3"],
        tags: tagIds,
        user : loggedInUserId,
        workspace: createdWorkspaceId
      };
  it("should return a list of Notes", function (done) {
    chai
      .request(app)
      .get("/api/notes/")
      .set('Authorization', `Bearer ${loggedInUserToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  }).timeout(10000);

  it("should create a new Note", function (done) {
    chai
      .request(app)
      .post("/api/notes/add-note")
      .send(testNote)
      .set('Authorization', `Bearer ${loggedInUserToken}`)
      .end((err, res) => {
        if (err) {
          console.error(err);
          done(err);
        } else {
          console.log(res.body);
          res.should.have.status(200);
          createdNoteId = res.body.newNote._id;
          done();
        }
      });
  }).timeout(20000);

  const updatedNoteData ={
    title: "Updated Test Note",
    answers: ["Test Answer 1","Updated Test Answer 2",],
    tags: tagIds,
    
  };

  it("should update note by Id", function (done) {
    chai
      .request(app)
      .put(`/api/notes/update-note/${createdNoteId}`)
      .set('Authorization', `Bearer ${loggedInUserToken}`)
      .send(updatedNoteData)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  }).timeout(10000);

  
  it("should return error for invalid note id ", function (done) {
    chai
      .request(app)
      .put(`/api/notes/update-note/${invalidNoteId}`)
      .set('Authorization', `Bearer ${loggedInUserToken}`)
      .send(updatedNoteData)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  }).timeout(10000);

  it("should delete a note", function (done) {
    chai
      .request(app)
      .delete(`/api/notes/delete-note/${createdNoteId}`)
      .set('Authorization', `Bearer ${loggedInUserToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  }).timeout(10000);

  it("should return error for invalid note id ", function (done) {
    chai
      .request(app)
      .delete(`/api/notes/delete-note/${invalidNoteId}`)
      .set('Authorization', `Bearer ${loggedInUserToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  }).timeout(10000);
});
