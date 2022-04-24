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
	updatedAt: Date;

	toJSON() {
		return instanceToPlain(this);
	}
}
