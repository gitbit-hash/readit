import {
	BeforeInsert,
	Column,
	Entity as TOEntity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { makeId, string_to_slug } from '../utils/helpers';
import { Comment } from './Comment';
import Entity from './Entity';
import { Sub } from './Sub';
import { User } from './User';
import { Vote } from './Vote';

@TOEntity('posts')
export class Post extends Entity {
	constructor(post: Partial<Post>) {
		super();
		Object.assign(this, post);
	}

	@Column()
	@Index()
	identifier: string; // 7 characters id

	@Column()
	title: string;

	@Index()
	@Column()
	slug: string;

	@Column({ nullable: true, type: 'text' })
	body: string;

	@Column()
	subName: string;

	@Column()
	username: string;

	@ManyToOne(() => User, (user) => user.posts)
	@JoinColumn({ name: 'username', referencedColumnName: 'username' })
	user: User;

	@ManyToOne(() => Sub, (sub) => sub.posts)
	@JoinColumn({ name: 'subName', referencedColumnName: 'name' })
	sub: Sub;

	@OneToMany(() => Comment, (comment) => comment.post)
	comments: Comment[];

	@Exclude()
	@OneToMany(() => Vote, (vote) => vote.post)
	votes: Vote[];

	@Expose() get url(): string {
		return `/r/${this.subName}/${this.identifier}/${this.slug}`;
	}

	@Expose() get commentCount(): number {
		return this.comments?.length;
	}

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
		this.identifier = makeId(7);
		this.slug = string_to_slug(this.title);
	}
}
