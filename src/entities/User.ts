import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	Index,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
	constructor(user: Partial<User>) {
		super();
		Object.assign(this, user);
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	@Index()
	username: string;

	@Index()
	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updateddAt: Date;
}
