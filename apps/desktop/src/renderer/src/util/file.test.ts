import { fileSize } from "./file";

describe('File Utilities Tests', () => {
  
  it('Should return file size in bytes', () => {
    expect(fileSize(500)).toEqual(['500', 'B']);
  })

  it('Should return file size in kilobytes', () => {
    expect(fileSize(2048)).toEqual(['2', 'Kb']);
  })

  it('Should return file size in megabytes', () => {
    expect(fileSize(2097152)).toEqual(['2', 'Mb']);
  })

  it('Should return file size in gigabytes', () => {
    expect(fileSize(2147483648)).toEqual(['2', 'Gb']);
  })

  it('Should return 0 bytes when negative', () => {
    expect(fileSize(-10000)).toEqual(['0', 'B']);
  })

})