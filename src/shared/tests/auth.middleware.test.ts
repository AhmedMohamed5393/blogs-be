import { Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { verifyToken, getUserData } from '../utils/jwt';
import { getLogger } from '../utils/helpers';

// Mock the jwt and helpers modules
jest.mock('../utils/jwt');
jest.mock('../utils/helpers');

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Initialize the middleware
    authMiddleware = new AuthMiddleware();
  
    // Mock request, response, and next function
    mockRequest = {
      cookies: {},
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    };
    mockNext = jest.fn();
  
    // Mock utility functions
    (verifyToken as jest.Mock).mockReturnValue({ username: 'john@example.com' });
    (getUserData as jest.Mock).mockResolvedValue({ id: 1 });
    (getLogger as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoiYWhtZWRtb2hhbWVkYWxleDkzQGdtYWlsLmNvbSIsImlhdCI6MTczNjYzMTc3OCwiZXhwIjoxNzM2NjM1Mzc4fQ.S3iqu6wQXzQHvAP3e8vkKDlMPhn_RqA7VimM8HcBIPo";

    it('should set user data in res.locals if token is valid', async () => {
      // Arrange
      mockRequest.cookies = { token };
  
      // Act
      await authMiddleware.execute(mockRequest as Request, mockResponse as Response, mockNext);
  
      // Assert
      expect(verifyToken).toHaveBeenCalledWith(mockRequest.cookies.token);
      expect(getUserData).toHaveBeenCalledWith('john@example.com');
      expect(mockResponse.locals?.user).toEqual({ id: 1 });
      expect(mockNext).toHaveBeenCalled();
    });
  
    it('should return 401 if token is missing', async () => {
      // Arrange
      mockRequest.cookies = {};
  
      // Act
      await authMiddleware.execute(mockRequest as Request, mockResponse as Response, mockNext);
  
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  
    it('should return 401 if token is invalid', async () => {
      // Arrange
      mockRequest.cookies = { token: 'eyJhbGcigfd.eyJzdWIiOjIsInVzZXJuYW1lIjoiYWhtZWRtb2hhbWVkYWxleDkzQGdtYWlsLmNvbSIsImlhdCI6MTczNjYzMTc3OCwiZXhwIjoxNzM2NjM1Mzc4fQ' };
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
  
      // Act
      await authMiddleware.execute(mockRequest as Request, mockResponse as Response, mockNext);
  
      // Assert
      expect(verifyToken).toHaveBeenCalledWith(mockRequest.cookies.token);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  
    it('should return 401 if getUserData fails', async () => {
      // Arrange
      mockRequest.cookies = { token };
      (getUserData as jest.Mock).mockRejectedValue(new Error('User not found'));
  
      // Act
      await authMiddleware.execute(mockRequest as Request, mockResponse as Response, mockNext);
  
      // Assert
      expect(verifyToken).toHaveBeenCalledWith(mockRequest.cookies.token);
      expect(getUserData).toHaveBeenCalledWith('john@example.com');
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
