import { HttpStatus } from '@nestjs/common';

export const ssoSuccessMessageCode = {
  /*** attachment added */
  SCDTDT0000: {
    httpCode: HttpStatus.CREATED,
    fabdCode: 'SCCSCS0000',
    message: 'Service Running.',
  },
};
