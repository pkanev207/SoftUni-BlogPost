import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { IPost } from '../post.model';
import { IUser } from 'src/app/auth/user.model';

import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  post?: IPost | any;
  user!: IUser;
  id!: string;
  isLoading: boolean = false;
  isMakingComment: boolean = false;
  isAuthor: boolean = false;
  hasLiked: boolean = false;
  private detailsPageSubs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private userService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.detailsPageSubs.push(
      this.route.params
        .pipe(
          map((params: Params) => {
            return params;
          })
        )
        .subscribe({
          next: (params) => {
            this.id = params['id'];
          },
          error: () => {},
          complete: () => {},
        })
    );

    this.detailsPageSubs.push(
      this.postsService.getOneById(this.id).subscribe({
        next: (res) => {
          this.post = res.payload.data() as IPost;
          this.user = this.userService.getUser();
          if (this.user && this.post) {
            this.isAuthor = this.post.uid === this.user.uid;
            this.hasLiked = this.post.likes.includes(this.user.uid);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        },
        complete: () => {},
      })
    );
  }

  passCurrentPost() {
    this.postsService.setCurrentPost(this.post);
  }

  onDelete() {
    if (confirm('Delete this post?') == true) {
      this.postsService.del(this.id);
    } else {
      return;
    }
  }

  onLike() {
    this.post.likes.push(this.user.uid);
    this.postsService.likePost(this.post.id!, { likes: this.post.likes });
  }

  onComment() {
    this.isMakingComment = true;
  }

  onSubmitComment(form: NgForm) {
    const comment = { ...form.value, ...this.user };
    this.post.comments.push(comment);
    this.postsService.addComment(this.post.comments, this.post.id);
    this.isMakingComment = false;
  }

  ngOnDestroy(): void {
    this.detailsPageSubs.forEach((sub) => sub.unsubscribe());
  }
}
