// import chai from "chai";
// import chaiHttp from "chai-http";
// import app from "../script.js";

// const should = chai.should();

// chai.use(chaiHttp);

// describe("Signup and Signin API", () => {
//   const testUser = {
//     fullName: "Binish",
//     email: "binish@gmail.com",
//     password: "1234",
//   };

//   const existedUser = {
//     fullName: "Hina",
//     email: "hina@gmail.com",
//     password: "1234",
//   };
//   describe("Signup", () => {
//     it('should register a new user', (done) => {
//       chai
//         .request(app)
//         .post('/api/auth/signup')
//         .send(testUser)
//         .end((err, res) => {
//           res.should.have.status(200);
//           done();
//         });
//     }).timeout(20000);

//     it("should return an error if the email is taken and isVerified status is true", (done) => {
//       chai
//         .request(app)
//         .post("/api/auth/signup")
//         .send(existedUser)
//         .end((err, res) => {
//           res.should.have.status(409);
//           done();
//         });
//     }).timeout(5000);
//   });
//   describe("Signin", () => {
//     it("should log in a registered user with valid credentials", (done) => {
//       chai
//         .request(app)
//         .post("/api/auth/signin")
//         .send({ email: "hina@gmail.com", password: "1234" })
//         .end((err, res) => {
//           res.should.have.status(200);
//           done();
//         });
//     }).timeout(5000);

//     it("should return an error for login with invalid password", (done) => {
//       chai
//         .request(app)
//         .post("/api/auth/signin")
//         .send({ email: "hina@gmail.com", password: "12345" })
//         .end((err, res) => {
//           res.should.have.status(401);
//           done();
//         });
//     }).timeout(5000);

//     it("should return an error for login with invalid email", (done) => {
//       chai
//         .request(app)
//         .post("/api/auth/signin")
//         .send({ email: "hinasha@gmail.com", password: "12345" })
//         .end((err, res) => {
//           res.should.have.status(401);
//           done();
//         });
//     }).timeout(5000);
//   });
//   describe("Verify Email", () => {
//     it("should verify user with valid link", (done) => {
//       const userId = "64e64e155f614750ebf6f544";
//       const token = "ebc9c83eb4e94cc3d1a55776dd9eca5bf95e1090";
//       chai
//         .request(app)
//         .post(`/api/auth/verify/${userId}/${token}`)
//         .end((err, res) => {
//           res.should.have.status(200);
//           done();
//         });
//     }).timeout(5000);

//     it("should return an error with invalid id", (done) => {
//       const inValidUserId = "64f1b78b58f78c1bb087";
//       const verificationToken = "356148c0b89b0a03112445db05ce9b87159044a3";
//       chai
//         .request(app)
//         .post(`/api/auth/verify/${inValidUserId}/${verificationToken}`)
//         .end((err, res) => {
//           res.should.have.status(404);
//           done();
//         });
//     }).timeout(5000);
//   });
// });
