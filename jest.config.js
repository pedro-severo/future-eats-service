// eslint-disable-next-line no-undef
module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'node',
    testMatch: [
        '**/__tests__/**/*.(js|ts)?(x)',
        '**/?(*.)+(spec|test).(js|ts)?(x)',
    ],
    testPathIgnorePatterns: ['<rootDir>/integration.test.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    coverageReporters: ['lcov', 'text-summary'],
    coverageDirectory: 'coverage',
    coverageThreshold: {
        global: {
            lines: 100,
        },
    },
};
