import {
  IsEmail,
  IsEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class AuthCredential {
  @IsEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password too weak`,
  })
  password: string;

  @IsEmpty()
  phoneNumber: string;

  @IsEmpty()
  role: string;
}
