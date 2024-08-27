module.exports = {
	moduleFileExtensions: [ 'js', 'json', 'ts'],
	rootDir: '.',
	testRegex: '.*\\.spec\\.ts$',
    transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
    bail: false,
	verbose: true,
	collectCoverage: true,
    collectCoverageFrom: [
		'<rootDir>/src/modules/v1.0/todos/1.0/usecases/*.usecase.ts',
		'<rootDir>/src/modules/v1.0/todos/1.0/*.controller.ts',
	],
    coverageReporters: ['lcov', 'text', 'text-summary'],
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'<rootDir>/libraries/',
		'src/common/*',
		'src/configs/*',
		'src/consts/*',
		'src/databases/*',
		'src/libraries/*',
		'src/middleware/*',
		'src/main.ts',
		'src/app.module.ts',
	],
	testEnvironment: 'node',
	moduleNameMapper: {
		'^@app/(.*)$': '<rootDir>/src/$1',
	},
};