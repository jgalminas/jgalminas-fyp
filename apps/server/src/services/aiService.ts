import { HighlightTimeframe, IMatch } from "@fyp/types";
import os from 'os';
import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises'; 
import { randomUUID } from 'crypto'
import path from 'path';

export class AIService {

  public getTimeframes({ puuid, match }: { puuid: string, match: IMatch }): Promise<HighlightTimeframe[]> {
    return new Promise(async(resolve, reject) => {

      const baseDir = path.join(__dirname, '..', '..');

      const aiPath = path.join(baseDir, os.platform() === 'win32' ? 'ai.exe' : 'ai');
      const tempFilePath = path.join(baseDir, randomUUID() + '.json');

      const input = JSON.stringify({
        puuid: puuid,
        data: JSON.stringify(match)
      })
  
      // Write JSON data to a temporary file
      await writeFile(tempFilePath, input, {
        encoding: 'utf-8'
      });
  
      // Execute the command with the file path as an argument
      const proc = spawn(aiPath, [tempFilePath]);

      proc.stdout.on('data', (data) => {
        resolve(JSON.parse(data));
      })

      proc.stderr.on('data', async(err) => {
        //   await unlink(tempFilePath); // remove temp file
        reject(err);
      })

      proc.on('exit', async() => {
        await unlink(tempFilePath); // remove temp file
      })

    })
  }

}