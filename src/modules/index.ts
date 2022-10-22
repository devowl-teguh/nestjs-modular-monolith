import { ModuleAliasExplorer } from './../core/module';
import { MemberModule } from './member/member.module';
export const MODULES = {
  MEMBER_MODULE: MemberModule,
};

export const ACTIVE_MODULES = ModuleAliasExplorer.explore(MODULES);
