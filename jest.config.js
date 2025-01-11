module.exports = {
    testEnvironment: 'node',
    preset: 'ts-jest',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/*.test.ts'],
    moduleNameMapper: {
        '^@database/(.*)$': '<rootDir>/src/database/$1',
    },
}