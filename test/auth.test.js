import chai from "chai";
import chaiHttp from "chai-http";
import app from "../script.js";

const should = chai.should();

chai.use(chaiHttp);

describe("Signup and Signin API", () => {
  const testUser = {
    fullName: "Bano",
    email: "bano@gmail.com",
    password: "1234",
  };

  const existedUser = {
    fullName: "Hina",
    email: "hina@gmail.com",
    password: "1234",
  };
  describe("Signup", () => {
    it('should register a new user', (done) => {
      chai
        .request(app)
        .post('/api/auth/signup')
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').equal('Signup successful. Please check your email to verify your account.');
          done();
        });
    }).timeout(20000);

    it("should return an error if the email is taken and isVerified status is true", (done) => {
      chai
        .request(app)
        .post("/api/auth/signup")
        .send(existedUser)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have
            .property("message")
            .equal("User already exists please try another email");
          done();
        });
    }).timeout(5000);
  });
  describe("Signin", () => {
    it("should log in a registered user with valid credentials", (done) => {
      chai
        .request(app)
        .post("/api/auth/signin")
        .send({ email: "hina@gmail.com", password: "1234" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").equal("Login successful.");
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
          res.body.should.have
            .property("message")
            .equal("Invalid password please enter valid password");
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
          res.body.should.have
            .property("message")
            .equal("Email is not registered");
          done();
        });
    }).timeout(5000);
  });
  describe("Verify Email", () => {
    it("should verify user with valid link", (done) => {
      const userId = "64f1b78b58f78c1bb087e519";
      const token = "356148c0b89b0a03112445db05ce9b87159044a3";
      chai
        .request(app)
        .post(`/api/auth//verify/${userId}/${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have
            .property("message")
            .equal("Your email has been verified successfully");
          done();
        });
    }).timeout(5000);

    it("should return an error with invalid id", (done) => {
      const inValidUserId = "64f1b78b58f78c1bb087";
      const verificationToken = "356148c0b89b0a03112445db05ce9b87159044a3";
      chai
        .request(app)
        .post(`/api/auth//verify/${inValidUserId}/${verificationToken}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("message").equal("Invalid link");
          done();
        });
    }).timeout(5000);
  });
});
