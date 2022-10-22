/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigService } from './../../shared/services/config.service';

export class ModuleAliasExplorer {
  static explore(modules: { [key: string]: any }): any {
    const arr: any[] = [];
    const configService = new ConfigService();
    const names = configService.getActiveModules();
    for (const name of names) {
      const obj = modules[name];
      if (obj) arr.push(obj);
    }
    return arr;
  }
}
