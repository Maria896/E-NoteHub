import chai from "chai";
import chaiHttp from "chai-http";
import app from "../script.js";
import { loggedInUserToken } from "./auth.test.js";
const should = chai.should();

chai.use(chaiHttp);

let createdTagId;
describe("Tag Routes", function () {
  it("should return a list of Tags", function (done) {
    chai
      .request(app)
      .get("/api/tags/")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  }).timeout(10000);
  
  it("should create a new tag", function (done) {
    chai
      .request(app)
      .post("/api/tags/add-tag/")
      .send({ name: "Test Tag" })
      .end((err, res) => {
        if (err) {
          console.error(err);
          done(err);
        } else {
          console.log(res.body); 
          createdTagId = res.body.newTag._id;
          res.should.have.status(200);
          done();
        }
      });
  }).timeout(20000);
  
  const updatedTagData = { name: "Updated Tag" };

  it("should update tag by Id", function (done) {
    chai
      .request(app)
      .put(`/api/tags/update-tag/${createdTagId}`)
      .send(updatedTagData)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  }).timeout(10000);

  const invalidTagId = "54e2beb89c8a052c3ce3610a";
  it("should return error for invalid tag id ", function (done) {
    chai
      .request(app)
      .put(`/api/tags/update-tag/${invalidTagId}`)
      .send(updatedTagData)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  }).timeout(10000);

  it("should delete a tag", function (done) {
    chai
      .request(app)
      .delete(`/api/tags/delete-tag/${createdTagId}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  }).timeout(10000);

  it("should return error for invalid tag id ", function (done) {
    chai
      .request(app)
      .delete(`/api/tags/delete-tag/${invalidTagId}`)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  }).timeout(10000);
});
