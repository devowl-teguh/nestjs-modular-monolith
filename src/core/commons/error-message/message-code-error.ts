'use strict';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IErrorMessage } from '../../../core/interfaces/error-message.interface';

import { errorMessagesConfig } from './error-message';

export class MessageCodeError extends Error {
  public messageCode: string;
  public statusCode: string;
  public message: string;

  constructor(messageCode: string) {
    super();

    const errorMessageConfig = this.getMessageFromMessageCode(messageCode);
    if (!errorMessageConfig)
      throw new Error('Unable to find message code error.');

    if (errorMessageConfig.httpStatus === 400) {
      throw new BadRequestException({
        status: errorMessageConfig.status,
        statusCode: errorMessageConfig.statusCode,
        message: errorMessageConfig.message,
      });
    }

    if (errorMessageConfig.httpStatus === 404) {
      throw new NotFoundException({
        status: errorMessageConfig.status,
        statusCode: errorMessageConfig.statusCode,
        message: errorMessageConfig.message,
      });
    }

    /*
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.statusCode = errorMessageConfig.statusCode;
    this.messageCode = messageCode;
    this.message = errorMessageConfig.message;
    */
  }

  /**
   * @description: Find the error config by the given message code.
   * @param {string} messageCode
   * @return {IErrorMessages}
   */
  private getMessageFromMessageCode(messageCode: string): IErrorMessage {
    let errorMessageConfig: IErrorMessage | undefined;
    Object.keys(errorMessagesConfig).some((key) => {
      if (key === messageCode) {
        errorMessageConfig = errorMessagesConfig[key];
        return true;
      }
      return false;
    });

    if (!errorMessageConfig)
      throw new Error('Unable to find the given message code errorx.');
    return errorMessageConfig;
  }
}
