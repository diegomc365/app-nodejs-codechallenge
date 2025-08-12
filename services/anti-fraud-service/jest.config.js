module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["<rootDir>/test/**/*.spec.ts"],
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  moduleNameMapper: {
    "^@app/contracts(.*)$": "<rootDir>/../../packages/contracts/src$1", // 👈 ojo: ../../
  },
};
