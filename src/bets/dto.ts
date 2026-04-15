import { Type } from "class-transformer";
import { IsArray, IsIn, IsISO8601, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export type BetStatus = "win" | "loss" | "push" | "open";

export class BetDto {
  @IsString()
  platform!: string;

  @IsString()
  category!: string;

  @IsISO8601({ strict: false })
  date!: string;

  @IsString()
  time!: string;

  @IsNumber()
  @Min(0)
  stake!: number;

  @IsNumber()
  @Min(0)
  returnValue!: number;

  @IsIn(["win", "loss", "push", "open"])
  status!: BetStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class FlowDto {
  @IsString()
  text!: string;
}

export class ImportDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BetDto)
  bets!: BetDto[];
}
