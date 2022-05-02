import {
	BeforeInsert,
	Column,
	Entity as TOEntity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';

import Entity from './Entity';
import { Post } from './Post';
import { User } from './User';

import { makeId } from '../utils/helpers';
import { Vote } from './Vote';
import { Exclude, Expose } from 'class-transformer';

@TOEntity('comments')
export class Comment extends Entity {
	constructor(comment: Partial<Comment>) {
		super();
		Object.assign(this, comment);
	}
	@Index()
	@Column()
	identifier: string;

	@Column()
	body: string;

	@Column()
	username: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'username', referencedColumnName: 'username' })
	user: User;

	@ManyToOne(() => Post, (post) => post.comments, { nullable: false })
	post: Post;

	@Exclude()
	@OneToMany(() => Vote, (vote) => vote.comment)
	votes: Vote[];

	@Expose() get voteScore(): number {
		return this.votes?.reduce((acc, curr) => acc + (curr.value || 0), 0);
	}

	protected userVote: number;
	setUserVote(user: User) {
		const idx = this.votes?.findIndex(
			(vote) => vote.username === user.username
		);
		this.userVote = idx > -1 ? this.votes[idx].value : 0;
	}

	@BeforeInsert()
	makeIdAndSlug() {
		this.identifier = makeId(8);
	}
}
