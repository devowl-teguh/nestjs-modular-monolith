import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('profile')
@ApiTags('MemberProfile')
export class MemberProfileController {
  @Get()
  // @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: 'Show Profile' })
  @ApiConsumes('application/json')
  async getProfile(): Promise<any> {
    console.log('masuk')
    return {
      data: 'oke'
    }
  }
}
