import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class AppComponent implements OnInit {
  title = 'app';
  books: any[] = [];
  searchDone = false;
  currentIndex = 0;
  maxResult = 20;
  booksLength = 0;
  isLoadingResult = false;
  inputLoader = false;
  searchForm: FormGroup;

  constructor(private http: HttpClient) {
    this.searchForm = new FormGroup({
      query: new FormControl('')
    });

    this.searchForm.get('query').valueChanges
      .pipe(
        filter((query: string) => query?.length >= 3),
        distinctUntilChanged(),
        debounceTime(400)
      )
      .subscribe((query: string) => {
        this.isLoadingResult = true;
        this.currentIndex = 0;
        this.inputLoader = true;
        this.search(query, 0);
      });
  }

  ngOnInit(): void {}

  search(query: string, startIndex = 0): void {
    const authkey = 'AIzaSyCHAUsvzrWE0BWZDEDR_jkwKaZJfNhEUEM';
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${authkey}&maxResults=${this.maxResult}&startIndex=${startIndex}`;

    this.http.get<any>(url).subscribe(data => {
      this.inputLoader = false;
      this.books = data?.items || [];
      this.booksLength = this.books.length;
      this.searchDone = true;
      this.isLoadingResult = false;
    });
  }

  nextBtn = (): void => {
    if (this.booksLength / this.maxResult === 1) {
      this.isLoadingResult = true;
      this.currentIndex += this.maxResult;
      this.search(this.searchForm.get('query').value, this.currentIndex);
      window.scrollTo(0, 150);
    }
  }

  prevBtn = (): void => {
    if (this.currentIndex !== 0) {
      this.isLoadingResult = true;
      this.currentIndex -= this.maxResult;
      this.search(this.searchForm.get('query').value, this.currentIndex);
      window.scrollTo(0, 150);
    }
  }
}
