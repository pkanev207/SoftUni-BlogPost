import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPost } from './post.model';
import { AuthService } from '../auth/auth.service';
import { UIService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  // fetchedPosts = new Subject<Post[]>();

  // private postsSubscription: Subscription[] = [];
  // private availablePosts: Post[] = [];

  constructor(
    private router: Router,
    private db: AngularFirestore,
    private authService: AuthService,
    private uiService: UIService
  ) {}

  getAll() {
    console.log('From the getAll!');
    // this.postsSubscription.push(
    //   this.db
    //     .collection('posts')
    //     .snapshotChanges()
    //     .pipe(
    //       map((docArray) => {
    //         return docArray.map((doc) => {
    //           const data: any = doc.payload.doc.data();
    //           return { ...data };
    //         });
    //       })
    //     )
    //     .subscribe({
    //       next: (posts: Post[]) => {
    //         this.availablePosts = posts;
    //         // console.log(this.availablePosts);
    //         this.fetchedPosts.next([...this.availablePosts]);
    //       },
    //       error: (error) => {},
    //       complete: () => console.log('Fetch completed'),
    //     })
    // );

    return this.db
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            const data: any = doc.payload.doc.data();
            return { ...data };
          });
        })
      );
  }

  getOneById() {}

  create(data: any) {
    // console.log(this.authService.Iuser);
    const id = this.db.createId();
    const user = this.authService.getUser();
    const post = {
      ...data,
      id: id,
      uid: user.uid,
      author: user.name,
      authorEmail: user.email,
      date: new Date(),
      likes: [],
      comments: [],
    };

    console.log(post);
    this.db.collection('posts').doc(id).set(post);
    // this.db.collection('posts').add(post);
    this.router.navigate(['/posts']);
  }

  update() {}

  del() {}

  cancelSubscriptions() {}
}
