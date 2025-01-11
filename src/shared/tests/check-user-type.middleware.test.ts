import { Request, Response, NextFunction } from 'express';
import { CheckUserTypeMiddleware } from '../middlewares/checkUserTypeMiddleware';
import { decryptToken, getUserData } from '../utils/jwt';
import { getLogger } from '../utils/helpers';

// Mock the jwt and helpers modules
jest.mock('../utils/jwt');
jest.mock('../utils/helpers');

describe('CheckUserTypeMiddleware', () => {
  let checkUserTypeMiddleware: CheckUserTypeMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Initialize the middleware
    checkUserTypeMiddleware = new CheckUserTypeMiddleware();
  
    // Mock request, response, and next function
    mockRequest = {
      cookies: {},
      headers: {},
    };
    mockResponse = {
      locals: {},
    };
    mockNext = jest.fn();
  
    // Mock utility functions
    (decryptToken as jest.Mock).mockReturnValue({ username: 'john@example.com' });
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
      await checkUserTypeMiddleware.execute(mockRequest as Request, mockResponse as Response, mockNext);
  
      // Assert
      expect(decryptToken).toHaveBeenCalledWith(mockRequest.cookies.token);
      expect(getUserData).toHaveBeenCalledWith('john@example.com');
      expect(mockResponse.locals?.user).toEqual({ id: 1 });
      expect(mockNext).toHaveBeenCalled();
    });
  
    it('should call next() if token is missing', async () => {
      // Arrange
      mockRequest.cookies = {};
  
      // Act
      await checkUserTypeMiddleware.execute(mockRequest as Request, mockResponse as Response, mockNext);
  
      // Assert
      expect(decryptToken).not.toHaveBeenCalled();
      expect(getUserData).not.toHaveBeenCalled();
      expect(mockResponse.locals?.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  
    it('should call next() if token is invalid', async () => {
      // Arrange
      mockRequest.cookies = { token: 'eyJhbGcigfd.eyJzdWIiOjIsInVzZXJuYW1lIjoiYWhtZWRtb2hhbWVkYWxleDkzQGdtYWlsLmNvbSIsImlhdCI6MTczNjYzMTc3OCwiZXhwIjoxNzM2NjM1Mzc4fQ' };
      (decryptToken as jest.Mock).mockImplementation(() => undefined);
      (getUserData as jest.Mock).mockImplementation(() => undefined);
  
      // Act
      await checkUserTypeMiddleware.execute(mockRequest as Request, mockResponse as Response, mockNext);
  
      // Assert
      expect(decryptToken).toHaveBeenCalledWith(mockRequest.cookies.token);
      expect(getUserData).toHaveBeenCalled();
      expect(mockResponse.locals?.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  
    it('should call next() if getUserData fails', async () => {
      // Arrange
      mockRequest.cookies = { token };
      (decryptToken as jest.Mock).mockImplementation(() => undefined);
      (getUserData as jest.Mock).mockImplementation(() => undefined);
  
      // Act
      await checkUserTypeMiddleware.execute(mockRequest as Request, mockResponse as Response, mockNext);
  
      // Assert
      expect(decryptToken).toHaveBeenCalledWith(mockRequest.cookies.token);
      expect(getUserData).toHaveBeenCalled();
      expect(mockResponse.locals?.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
