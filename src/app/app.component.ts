import { Component, OnInit, Input } from '@angular/core';
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl } from '@angular/forms';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';

  books = [];
  findBook = '';
  searchDone = null;
  currentIndex = 0;
  maxResult = 20;
  booksLenght = null;
  isLoadingResult = null;
  inputLoader = null;
  searchForm: FormGroup

  search(query, startIndex = 0) {

    let authkey = 'AIzaSyCHAUsvzrWE0BWZDEDR_jkwKaZJfNhEUEM',
      url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${authkey}&maxResults=${this.maxResult}&startIndex=${startIndex}`;

    this.http.get(url).subscribe((response: Response) => {
      this.inputLoader = false;
      let data = response.json();
      this.books = data.items;
      this.booksLenght = data.items.length;
      this.searchDone = true;
      this.isLoadingResult = false;
    })

  }

  nextBtn = () => {
    if (this.booksLenght / this.maxResult == 1) {
      this.isLoadingResult = true;
      this.search(this.searchForm.get('query').value, this.currentIndex += this.maxResult);
      window.scrollTo(0, 150);

    }
  }

  prevBtn = () => {
    if (this.currentIndex !== 0) {
      this.isLoadingResult = true;
      this.search(this.searchForm.get('query').value, this.currentIndex -= this.maxResult);
      window.scrollTo(0, 150);
    }
  }




  constructor(private http: Http) {

    this.searchForm = new FormGroup({
      'query': new FormControl('')
    })

    this.searchForm.get('query').valueChanges
      .filter(query => query.length >= 3)
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(query => {
        this.isLoadingResult = true;
        this.currentIndex = 0;
        this.search(query, 0);
        this.inputLoader = true;
      })

  }

  ngOnInit() {

  }
}
