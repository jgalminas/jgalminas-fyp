
import { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  roots: [
    "<rootDir>/src"
  ],
  testMatch: [
    "<rootDir>/src/main/**/*.test.+(ts|js)",
    "<rootDir>/src/shared/**/*.test.+(ts|js)"
  ],
  transform: {
    "^.+\\.(ts)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.node.json" }],
  },
  setupFiles: ['<rootDir>/setup-files/env.ts'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)(\\?asset)?$': '<rootDir>/setup-files/fileTransformer.ts'
  }
}

export default config;