
import { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  roots: [
    "<rootDir>/src"
  ],
  testMatch: [
    "<rootDir>/src/**/*.test.+(ts|js)"
  ],
  transform: {
    "^.+\\.(ts)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
  setupFiles: ['<rootDir>/setup-files/env.ts']
}

export default config;