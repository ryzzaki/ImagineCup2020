import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { UserRoleEnums } from '../enums/user-roles.enum';
import { Length } from 'class-validator';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  email: string;

  @Column()
  @Length(2, 25)
  displayName: string;

  @Column()
  profilePicture: string;

  @Column()
  role: UserRoleEnums;

  @Column()
  tokenVer: number;
}
