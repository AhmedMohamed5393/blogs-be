import { UserRepository } from '../repositories/userRepository';
import { Database } from '../../../database/database';
import { ICreateUserRequest } from '../models/interfaces/requests/ICreateUserRequest';

// Mock the Database class
jest.mock('@database/database');

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockUserModel: {
    findFirst: jest.Mock;
    create: jest.Mock;
  };

  beforeEach(() => {
    // Initialize the repository
    userRepository = new UserRepository();

    // Mock the userModel
    mockUserModel = {
      findFirst: jest.fn(),
      create: jest.fn(),
    };

    // Replace the userModel in the repository with the mock
    (userRepository as any).userModel = mockUserModel;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserBy', () => {
    it('should return a user when found', async () => {
      // Arrange
      const where = { id: 1 };
      const select = { id: true, name: true };
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: '$2a$10$rtn8ZSQLMa3lAiYR9iYmJe6F4IA/XJ/FOzmqF5pZghKZzliCSZQVi',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserModel.findFirst.mockResolvedValue(mockUser);

      // Act
      const result = await userRepository.getUserBy(where, select);

      // Assert
      expect(mockUserModel.findFirst).toHaveBeenCalledWith({ where, select });
      expect(result).toEqual(mockUser);
    });

    it('should log an error when an exception occurs', async () => {
      // Arrange
      const where = { id: 1 };
      const select = { id: true, name: true };
      const mockError = new Error('Database error');

      mockUserModel.findFirst.mockRejectedValue(mockError);

      // Act
      const result = await userRepository.getUserBy(where, select);

      // Assert
      expect(mockUserModel.findFirst).toHaveBeenCalledWith({ where, select });
      expect(result).toBeUndefined();
    });
  });

  describe('createUser', () => {
    const userData: ICreateUserRequest = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '$2a$10$rtn8ZSQLMa3lAiYR9iYmJe6F4IA/XJ/FOzmqF5pZghKZzliCSZQVi',
    };

    it('should create and return a new user', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserModel.create.mockResolvedValue(mockUser);

      // Act
      const result = await userRepository.createUser(userData);

      // Assert
      expect(mockUserModel.create).toHaveBeenCalledWith({ data: userData });
      expect(result).toEqual(mockUser);
    });

    it('should log an error when an exception occurs', async () => {
      // Arrange
      const mockError = new Error('Database error');

      mockUserModel.create.mockRejectedValue(mockError);

      // Act
      const result = await userRepository.createUser(userData);

      // Assert
      expect(mockUserModel.create).toHaveBeenCalledWith({ data: userData });
      expect(result).toBeUndefined();
    });
  });
});