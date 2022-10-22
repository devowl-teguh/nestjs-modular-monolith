import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as uuid from 'uuid';

@Injectable()
export class GeneratorService {
  public uuid(): string {
    return uuid.v1();
  }
  public fileName(ext: string): string {
    return this.uuid() + '.' + ext;
  }

  public createAlfaCode(len: number): string {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = len; i > 0; --i)
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }

  public createNumericCode(len: number): string {
    let result = '';
    for (let i = 0; i < len; i++) {
      result += Math.random()
        .toString(10)
        .substr(2, 1);
    }
    return result;
  }

  public createAlfanumericCode(len: number): string {
    let result = '';
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = len; i > 0; --i)
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }

  public createMatchingNumber(body: IMatchingNumber): string {
    const alphaNumericOutletCode = body.outletCode.replace(/[^a-z0-9]/gi, '');
    const alphaNumericTrxDate = body.trxDate
      .substring(0, 10) // concate ex: from 2022-02-22 02:02:02 to 2022-02-22
      .replace(/[^a-z0-9]/gi, '');
    const alphaNumericTrxHourMinute = body.trxHourMinute
      .substring(0, 5) // concate ex: from 02:02:02 to 02:02
      .replace(/[^a-z0-9]/gi, '');
    const alphaNumericLastFiveTransNumber = body.salesNumber
      .replace(/[^a-z0-9]/gi, '')
      .slice(-5); // concate ex: from ABC-12345 to 12345

    const matchingNumber =
      alphaNumericOutletCode +
      alphaNumericTrxDate +
      alphaNumericTrxHourMinute +
      alphaNumericLastFiveTransNumber +
      Math.floor(body.grandTotal);

    return matchingNumber;
  }

  public createClaimCode(memberCode: string): string {
    const numberCode = this.createNumericCode(1);
    const alfaCode = this.createAlfaCode(1);
    const claimCode = `${moment().format(
      'YYYYMMDD',
    )}${memberCode}${numberCode}${alfaCode}`;
    return claimCode;
  }
}

interface IMatchingNumber {
  outletCode: string;
  trxDate: string;
  trxHourMinute: string;
  salesNumber: string;
  grandTotal: number;
}
