import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class PlatformDto {
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  name!: string;
}

export class AdminEmailDto {
  @IsEmail()
  @MaxLength(120)
  email!: string;
}
