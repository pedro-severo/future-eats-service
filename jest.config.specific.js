// eslint-disable-next-line no-undef
module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'node',
    testMatch: ['**/__tests__/integration.test.(js|ts)?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
