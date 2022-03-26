import {
	Entity as TOEntity,
	Column,
	Index,
	BeforeInsert,
	OneToMany,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { hash } from 'bcrypt';
import { Exclude } from 'class-transformer';

import Entity from './Entity';
import { Post } from './Post';

@TOEntity('users')
export class User extends Entity {
	constructor(user: Partial<User>) {
		super();
		Object.assign(this, user);
	}

	@Column({ unique: true })
	@Index()
	@Length(3, 255, { message: 'Must be at least 3 characters long' })
	username: string;

	@Column({ unique: true })
	@Index()
	@IsEmail(undefined, { message: 'Must be a valid email address' })
	@Length(1, 255, { message: 'Email is empty' })
	email: string;

	@Column()
	@Length(6, 255, { message: 'Must be at least 6 characters long' })
	@Exclude()
	password: string;

	@OneToMany(() => Post, (post) => post.user)
	posts: Post[];

	@BeforeInsert()
	async hashPassword() {
		this.password = await hash(this.password, 6);
	}
	fieldToLowerCase() {
		this.username = this.username.toLowerCase();
		this.email = this.email.toLowerCase();
	}
}
