// import chai from "chai";
// import chaiHttp from "chai-http";
// import app from "../script.js";
// const should = chai.should();

// chai.use(chaiHttp);

// describe("Workspace Routes", function () {
//   it("should return a list of workspaces", function (done) {
//     chai
//       .request(app)
//       .get("/api/workspace/")
//       .end((err, res) => {
//         res.should.have.status(200);
//         done();
//       });
//   }).timeout(10000);
//   let createdWorkspaceId;
//   it("should create a new workspace", function (done) {
//     chai
//       .request(app)
//       .post("/api/workspace/add-workspace/")
//       .send({ name: "Test Workspace" })
//       .end((err, res) => {
//         if (err) {
//           console.error(err);
//           done(err);
//         } else {
//           console.log(res.body); 
//           createdWorkspaceId = res.body.newWorkspace._id;
//           console.log(createdWorkspaceId);
//           res.should.have.status(200);
//           done();
//         }
//       });
//   }).timeout(5000);
//   const workspaceId = "64ee275772f2d8e8dcabf3b6";
//   const updatedWorkspaceData = { name: "Updated Workspace Name" };

//   it("should update a workspace", function (done) {
//     console.log(workspaceId);

//     chai
//       .request(app)
//       .put(`/api/workspace/update-workspace/${createdWorkspaceId}`)
//       .send(updatedWorkspaceData)
//       .end((err, res) => {
//         res.should.have.status(200);
//         done();
//       });
//   }).timeout(5000);

//   const invalidWorkspaceId = "12345678";
//   it("should return error for invalid workspace id ", function (done) {
//     chai
//       .request(app)
//       .put(`/api/workspace/update-workspace/${invalidWorkspaceId}`)
//       .send(updatedWorkspaceData)
//       .end((err, res) => {
//         res.should.have.status(404);
//         done();
//       });
//   }).timeout(5000);

//   it("should add a collaborator to a workspace", function (done) {
//     const collaboratorEmail = "hina@gmail.com";
//     chai
//       .request(app)
//       .put(`/api/workspace/add-collaborator/${createdWorkspaceId}`)
//       .send({ email: collaboratorEmail })
//       .end((err, res) => {
//         res.should.have.status(200);
//         done();
//       });
//   }).timeout(10000);


//   it("should delete a workspace", function (done) {
//     chai
//       .request(app)
//       .delete(`/api/workspace/delete-workspace/${createdWorkspaceId}`)
//       .end((err, res) => {
//         res.should.have.status(200);
//         done();
//       });
//   }).timeout(5000);

//   it("should return error for invalid workspace id ", function (done) {
//     chai
//       .request(app)
//       .delete(`/api/workspace/delete-workspace/${invalidWorkspaceId}`)
//       .end((err, res) => {
//         res.should.have.status(404);
//         done();
//       });
//   }).timeout(5000);
// });
