'use strict';

import { HttpStatus } from '@nestjs/common';

export interface IErrorMessage {
  statusCode: string;
  status: boolean;
  message: string;
  httpStatus: HttpStatus;
}
