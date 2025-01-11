import { Service } from '../service';
import { UserService } from '../services/userService';
import { Request, Response, NextFunction } from 'express';
import { encryptPassword, comparePassword } from '../../../shared/utils/bcrypt';
import { encryptToken } from '../../../shared/utils/jwt';

// Mock the UserService and utility functions
jest.mock('../services/userService');
jest.mock('../../../shared/utils/bcrypt');
jest.mock('../../../shared/utils/jwt');

describe('Service', () => {
  let service: Service;
  let mockUserService: jest.Mocked<UserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Initialize the service
    service = new Service();
  
    // Mock the UserService
    mockUserService = new UserService() as jest.Mocked<UserService>;
    (service as any).userService = mockUserService;
  
    // Mock request, response, and next function
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(), // Properly mock clearCookie
    };
    mockNext = jest.fn();
  
    // Mock utility functions
    (encryptPassword as jest.Mock).mockResolvedValue('hashedPassword');
    (comparePassword as jest.Mock).mockResolvedValue(true);
    (encryptToken as jest.Mock).mockReturnValue('jwtToken');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      mockRequest.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockUserService.checkExistance.mockResolvedValue(null);
      mockUserService.createUser.mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      });

      // Act
      await service.signup(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockUserService.checkExistance).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      });
      expect(encryptPassword).toHaveBeenCalledWith('password123');
      expect(mockUserService.createUser).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User is registered successfully',
        data: { id: 1, name: 'John Doe', email: 'john@example.com' },
      });
    });

    it('should return 403 if user already exists', async () => {
      // Arrange
      mockRequest.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockUserService.checkExistance.mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      });

      // Act
      await service.signup(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User is already exists',
      });
    });

    it('should return 422 if user creation fails', async () => {
      // Arrange
      mockRequest.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockUserService.checkExistance.mockResolvedValue(null);
      mockUserService.createUser.mockResolvedValue(null);

      // Act
      await service.signup(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Can't create user",
      });
    });

    it('should return 500 if an error occurs', async () => {
      // Arrange
      mockRequest.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockUserService.checkExistance.mockRejectedValue(new Error('Database error'));

      // Act
      await service.signup(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error occurred',
      });
    });
  });

  describe('signin', () => {
    it('should log in a user successfully', async () => {
      // Arrange
      mockRequest.body = {
        user: 'john@example.com',
        password: 'password123',
      };

      mockUserService.checkExistance.mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      });

      // Act
      await service.signin(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockUserService.checkExistance).toHaveBeenCalledWith({
        name: 'john@example.com',
        email: 'john@example.com',
      });
      expect(comparePassword).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(encryptToken).toHaveBeenCalledWith({
        sub: 1,
        username: 'john@example.com',
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith('token', 'jwtToken');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User is logged in successfully',
        data: { id: 1, name: 'John Doe', email: 'john@example.com' },
      });
    });

    it('should return 404 if user is not found', async () => {
      // Arrange
      mockRequest.body = {
        user: 'john@example.com',
        password: 'password123',
      };

      mockUserService.checkExistance.mockResolvedValue(null);

      // Act
      await service.signin(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User isn't found",
      });
    });

    it('should return 422 if passwords do not match', async () => {
      // Arrange
      mockRequest.body = {
        user: 'john@example.com',
        password: 'password123',
      };

      mockUserService.checkExistance.mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      });

      (comparePassword as jest.Mock).mockResolvedValue(false);

      // Act
      await service.signin(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Passwords mismatch',
      });
    });

    it('should return 500 if an error occurs', async () => {
      // Arrange
      mockRequest.body = {
        user: 'john@example.com',
        password: 'password123',
      };

      mockUserService.checkExistance.mockRejectedValue(new Error('Database error'));

      // Act
      await service.signin(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error occurred',
      });
    });
  });

  describe('signout', () => {
    it('should log out a user successfully', async () => {
      // Act
      await service.signout(mockRequest as Request, mockResponse as Response, mockNext);
  
      // Assert
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('token');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User is logged out successfully',
      });
    });
  
    it('should return 500 if an error occurs', async () => {
      // Arrange
      // Mock clearCookie to throw an error
      (mockResponse.clearCookie as jest.Mock).mockImplementation(() => {
        throw new Error('Clear cookie error');
      });
  
      // Act
      await service.signout(mockRequest as Request, mockResponse as Response, mockNext);
  
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error occurred',
      });
    });
  });
});
