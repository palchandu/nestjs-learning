import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class UserPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, typeof value);
    return value;
  }
}
