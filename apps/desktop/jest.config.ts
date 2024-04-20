
import { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: [
    "<rootDir>/src"
  ],
  testMatch: [
    "<rootDir>/src/**/*.test.+(ts|js|tsx)"
  ],
  transform: {
    "^.+\\.(ts)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.web.json" }],
  },
  setupFiles: ['<rootDir>/setup-files/env.ts'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)(\\?react|\\?asset)?$': '<rootDir>/setup-files/fileTransformer.ts',
    '^@renderer/(.*)$': '<rootDir>/src/renderer/src/$1',
    '^@root/(.*)$': '<rootDir>/src/$1',
    '^@assets/(.*)$': '<rootDir>/src/renderer/src/assets/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest-dom.config.ts']
}

export default config;
