import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	Index,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { hash } from 'bcrypt';
import { classToPlain, Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
	constructor(user: Partial<User>) {
		super();
		Object.assign(this, user);
	}

	@PrimaryGeneratedColumn()
	@Exclude()
	id: number;

	@Column({ unique: true })
	@Index()
	@Length(3, 255, { message: 'Username must be at least 3 characters long' })
	username: string;

	@Column({ unique: true })
	@Index()
	@IsEmail()
	email: string;

	@Column()
	@Length(6, 255, { message: 'Password must be at least 6 characters long' })
	@Exclude()
	password: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updateddAt: Date;

	@BeforeInsert()
	async hashPassword() {
		this.password = await hash(this.password, 6);
	}
	fieldToLowerCase() {
		this.username = this.username.toLowerCase();
		this.email = this.email.toLowerCase();
	}
	toJSON() {
		// return user after transformation excluding id and password
		return classToPlain(this);
	}
}
