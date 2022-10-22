import { Module } from '@nestjs/common';
import { MemberProfileController } from './infra/http/member';

@Module({
  // imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [MemberProfileController],
})
export class MemberModule {}
