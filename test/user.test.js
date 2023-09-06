import chai from "chai";
import chaiHttp from "chai-http";
import app from "../script.js";
import {loggedInUserId} from "./auth.test.js" 

const should = chai.should();

chai.use(chaiHttp);


describe("User Routes", function () {
  it("should return a list of All Users", function (done) {
    chai
      .request(app)
      .get("/api/user/")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  }).timeout(10000);
  
  
  const updatedUserData = { fullName: "Maria Saleem", profileImg: "https://picsum.photos/536/354" };

  it("should update user profile by Id", function (done) {
    chai
      .request(app)
      .put(`/api/user/update-user/${loggedInUserId}`)
      .send(updatedUserData)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  }).timeout(10000);

  const invalidUserId = "54e2beb89c8a052c3ce3610a";
  it("should return error for invalid tag id ", function (done) {
    chai
      .request(app)
      .put(`/api/user/update-user/${invalidUserId}`)
      .send(updatedUserData)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  }).timeout(10000);

  
});
