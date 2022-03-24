import {
	PrimaryGeneratedColumn,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { instanceToPlain, Exclude } from 'class-transformer';

export default abstract class Entity extends BaseEntity {
	@PrimaryGeneratedColumn()
	@Exclude()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updateddAt: Date;

	toJSON() {
		// return user after transformation excluding id and password
		return instanceToPlain(this);
	}
}
