import { IsNotEmpty, IsString } from 'class-validator';

export class LeaveRoomDTO {
  @IsString({
    message: 'Name must be a string',
  })
  @IsNotEmpty({
    message: 'Name cannot be empty',
  })
  name: string;
}