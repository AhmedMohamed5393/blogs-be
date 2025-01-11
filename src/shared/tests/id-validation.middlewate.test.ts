import { Request, Response, NextFunction } from 'express';
import { IdValidationMiddleware } from '../middlewares/idValidationMiddleware';
import { getLogger } from '../utils/helpers';

// Mock the helpers module
jest.mock('../utils/helpers');

describe('IdValidationMiddleware', () => {
  let idValidationMiddleware: IdValidationMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Initialize the middleware
    idValidationMiddleware = new IdValidationMiddleware();

    // Mock request, response, and next function
    mockRequest = {
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Mock the logger
    (getLogger as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should call next() if the ID is valid', async () => {
      // Arrange
      mockRequest.params = { id: '123' };

      // Act
      await idValidationMiddleware.execute(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 400 if the ID is missing', async () => {
      // Arrange
      mockRequest.params = {};

      // Act
      await idValidationMiddleware.execute(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid id' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 if the ID is not a number', async () => {
      // Arrange
      mockRequest.params = { id: 'abc' };

      // Act
      await idValidationMiddleware.execute(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid id' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
