import chai from "chai";
import chaiHttp from "chai-http";
import app from "../script.js";
import User from "../schemas/userSchema.js";

const should = chai.should();

chai.use(chaiHttp);
export let loggedInUserId;
export let loggedInUserToken;
let registeredUserId;
let registeredUserToken;
describe("Signup and Signin API", () => {
  const testUser = {
    fullName: `testuser-${Date.now()}`,
    email: `testuser-${Date.now()}@example.com`,
    password: "testpassword",
  };

  describe("Signup", () => {
    it("should register a new user", (done) => {
      chai
        .request(app)
        .post("/api/auth/signup")
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(200);
          console.log(res.body);
          registeredUserId = res.body.user._id;
          registeredUserToken = res.body.user.verificationToken;
          done();
        });
    }).timeout(40000);

    it("should verify user with valid link", (done) => {
      chai
        .request(app)
        .get(`/api/auth/verify/${registeredUserToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    }).timeout(5000);

    it("should return an error with invalid id", (done) => {
      const inValidUserId = "64f1b78b58f78c1bb087";
      const invalidVerificationToken =
        "356148c0b89b0a03112445db05ce9b87159044a3";
      chai
        .request(app)
        .post(`/api/auth/verify/${invalidVerificationToken}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    }).timeout(5000);

    it("should return an error if the email is taken and isVerified status is true", (done) => {
      chai
        .request(app)
        .post("/api/auth/signup")
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    }).timeout(10000);
  });

  describe("Signin", () => {
    it("should log in a registered user with valid credentials", (done) => {
      chai
        .request(app)
        .post("/api/auth/signin")
        .send({ email: testUser.email, password: testUser.password })
        .end((err, res) => {
          res.should.have.status(200);
          loggedInUserId = res.body.user._id;
          loggedInUserToken = res.body.token;
          done();
        });
    }).timeout(5000);

    it("should return an error for login with invalid password", (done) => {
      chai
        .request(app)
        .post("/api/auth/signin")
        .send({ email: "hina@gmail.com", password: "12345" })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    }).timeout(5000);

    it("should return an error for login with invalid email", (done) => {
      chai
        .request(app)
        .post("/api/auth/signin")
        .send({ email: "hinasha@gmail.com", password: "12345" })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    }).timeout(5000);
  });
  // Delete created users after the tests
  // after(async () => {
  // 	try {
  // 		await User.deleteMany({
  // 			email: /^testuser-/,
  // 		});
  // 	} catch (error) {
  // 		console.error("Error deleting users:", error);
  // 	}
  // });
});
