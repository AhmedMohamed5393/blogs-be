// import request from 'supertest';
// import express, { Express } from 'express';
// import { UserService } from '../services/userService';

// describe('User Endpoints', () => {
//   let app: Express;

//   beforeAll(async () => {
//     app = express(); // Initialize your Express app
//   });

//   afterAll(async () => {
//     // Clean up resources (e.g., close database connections)
//   });

//   describe('POST /auth/signup', () => {
//     it('should create a new user', async () => {
//       const userData = {
//         name: 'John Doe',
//         email: 'john@example.com',
//         password: 'password123',
//       };

//       const response = await request(app)
//         .post('/auth/signup')
//         .send(userData)
//         .expect(201);

//       expect(response.body).toEqual({
//         message: 'User is registered successfully',
//         data: {
//           id: expect.any(Number),
//           name: 'John Doe',
//           email: 'john@example.com',
//         },
//       });

//       // Verify the user was created in the database
//       const user = await new UserService().checkExistance({ email: 'john@example.com' })
//       expect(user).not.toBeNull();
//     });

//     it('should return 403 if user already exists', async () => {
//       const userData = {
//         name: 'John Doe',
//         email: 'john@example.com',
//         password: 'password123',
//       };

//       // Create a user first
//       await request(app).post('/auth/signup').send(userData);

//       // Try to create the same user again
//       const response = await request(app)
//         .post('/auth/signup')
//         .send(userData)
//         .expect(403);

//       expect(response.body).toEqual({
//         message: 'User is already exists',
//       });
//     });

//     it('should return 422 if user creation fails', async () => {
//       const userData = {
//         name: 'John Doe',
//         email: 'john@example.com',
//         password: 'password123',
//       };

//       // Mock the UserService to return null
//       jest.spyOn(UserService.prototype, 'createUser').mockResolvedValue(null);

//       const response = await request(app)
//         .post('/auth/signup')
//         .send(userData)
//         .expect(422);

//       expect(response.body).toEqual({
//         message: "Can't create user",
//       });
//     });
//   });

//   describe('POST /auth/signin', () => {
//     it('should log in a user successfully', async () => {
//       const userData = {
//         user: 'john@example.com',
//         password: 'password123',
//       };

//       // Create a user first
//       await request(app).post('/auth/signup').send({
//         name: 'John Doe',
//         email: 'john@example.com',
//         password: 'password123',
//       });

//       const response = await request(app)
//         .post('/auth/signin')
//         .send(userData)
//         .expect(200);

//       expect(response.body).toEqual({
//         message: 'User is logged in successfully',
//         data: {
//           id: expect.any(Number),
//           name: 'John Doe',
//           email: 'john@example.com',
//         },
//       });

//       // Verify the token cookie is set
//       expect(response.headers['set-cookie']).toBeDefined();
//     });

//     it('should return 404 if user is not found', async () => {
//       const userData = {
//         user: 'nonexistent@example.com',
//         password: 'password123',
//       };

//       const response = await request(app)
//         .post('/auth/signin')
//         .send(userData)
//         .expect(404);

//       expect(response.body).toEqual({
//         message: "User isn't found",
//       });
//     });

//     it('should return 422 if passwords do not match', async () => {
//       const userData = {
//         user: 'john@example.com',
//         password: 'wrongpassword',
//       };

//       // Create a user first
//       await request(app).post('/auth/signup').send({
//         name: 'John Doe',
//         email: 'john@example.com',
//         password: 'password123',
//       });

//       const response = await request(app)
//         .post('/auth/signin')
//         .send(userData)
//         .expect(422);

//       expect(response.body).toEqual({
//         message: 'Passwords mismatch',
//       });
//     });
//   });

//   describe('GET /auth/signout', () => {
//     it('should log out a user successfully', async () => {
//       const response = await request(app)
//         .get('/auth/signout')
//         .expect(200);

//       expect(response.body).toEqual({
//         message: 'User is logged out successfully',
//       });

//       // Verify the token cookie is cleared
//       expect(response.headers['set-cookie']).toBeDefined();
//     });
//   });
// });
