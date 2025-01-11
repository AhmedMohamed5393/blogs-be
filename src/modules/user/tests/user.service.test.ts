import { UserService } from '../services/userService';
import { UserRepository } from '../repositories/userRepository';
import { UserMapper } from '../mappers/user.mapper';
import { IUserCheck } from '../models/interfaces/requests/IUserCheck';
import { CreateUserDto } from '../models/dtos/create-user.dto';

// Mock the UserRepository and UserMapper
jest.mock('../repositories/userRepository');
jest.mock('../mappers/user.mapper');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserMapper: jest.Mocked<UserMapper>;

  beforeEach(() => {
    // Mock the UserRepository and UserMapper
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    mockUserMapper = new UserMapper() as jest.Mocked<UserMapper>;
  
    // Initialize the service with the mocked repository
    userService = new UserService(mockUserRepository);
  
    // Inject the mocked UserMapper into the service
    (userService as any).userMapper = mockUserMapper;
  
    // Mock the repository methods
    mockUserRepository.getUserBy.mockResolvedValue(null);
    mockUserRepository.createUser.mockResolvedValue({ id: 1, name: 'John Doe', email: 'john@example.com' });
  
    // Mock the mapper method
    mockUserMapper.getCreateUserMapper.mockImplementation((data) => ({
      name: data.name,
      email: data.email,
      password: 'hashedPassword', // Simulate a hashed password
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkExistance', () => {
    it('should return a user if they exist', async () => {
      // Arrange
      const userInfo: IUserCheck = { name: 'John Doe', email: 'john@example.com' };
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', password: 'hashedPassword' };

      mockUserRepository.getUserBy.mockResolvedValue(mockUser);

      // Act
      const result = await userService.checkExistance(userInfo);

      // Assert
      expect(mockUserRepository.getUserBy).toHaveBeenCalledWith(
        { OR: [{ name: userInfo.name }, { email: userInfo.email }] },
        { id: true, name: true, email: true, password: true },
      );
      expect(result).toEqual(mockUser);
    });

    it('should log an error when an exception occurs', async () => {
      // Arrange
      const userInfo: IUserCheck = { name: 'John Doe', email: 'john@example.com' };
      const mockError = new Error('Database error');

      mockUserRepository.getUserBy.mockRejectedValue(mockError);

      // Act
      const result = await userService.checkExistance(userInfo);

      // Assert
      expect(mockUserRepository.getUserBy).toHaveBeenCalledWith(
        { OR: [{ name: userInfo.name }, { email: userInfo.email }] },
        { id: true, name: true, email: true, password: true },
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getUserBy', () => {
    it('should return a user when found', async () => {
      // Arrange
      const where = { id: 1 };
      const select = { id: true, name: true };
      const mockUser = { id: 1, name: 'John Doe' };

      mockUserRepository.getUserBy.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserBy(where, select);

      // Assert
      expect(mockUserRepository.getUserBy).toHaveBeenCalledWith(where, select);
      expect(result).toEqual(mockUser);
    });

    it('should log an error when an exception occurs', async () => {
      // Arrange
      const where = { id: 1 };
      const select = { id: true, name: true };
      const mockError = new Error('Database error');

      mockUserRepository.getUserBy.mockRejectedValue(mockError);

      // Act
      const result = await userService.getUserBy(where, select);

      // Assert
      expect(mockUserRepository.getUserBy).toHaveBeenCalledWith(where, select);
      expect(result).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      // Arrange
      const userData: CreateUserDto = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
  
      mockUserRepository.createUser.mockResolvedValue(mockUser);
  
      // Act
      const result = await userService.createUser(userData);
  
      // Assert
      // Verify that the mapper was called with the correct input
      expect(mockUserMapper.getCreateUserMapper).toHaveBeenCalledWith(userData);
  
      // Verify that the repository was called with the mapped payload
      expect(mockUserRepository.createUser).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword', // This should match the mock implementation
      });
  
      // Verify the result
      expect(result).toEqual(mockUser);
    });
  
    it('should log an error when an exception occurs', async () => {
      // Arrange
      const userData: CreateUserDto = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const mockError = new Error('Database error');
  
      mockUserRepository.createUser.mockRejectedValue(mockError);
  
      // Act
      const result = await userService.createUser(userData);
  
      // Assert
      // Verify that the mapper was called with the correct input
      expect(mockUserMapper.getCreateUserMapper).toHaveBeenCalledWith(userData);
  
      // Verify that the repository was called with the mapped payload
      expect(mockUserRepository.createUser).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword', // This should match the mock implementation
      });
  
      // Verify the result
      expect(result).toBeUndefined();
    });
  });
});
