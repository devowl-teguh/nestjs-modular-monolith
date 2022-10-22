import * as fs from 'fs';

export class ConfigGeneralService {
  public getConfig(key: string): any {
    const readFile = fs.readFileSync('config-general.json', 'utf-8');
    const json = JSON.parse(readFile);
    return json[key];
  }
}
