import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { BooksService, BookItem } from './services/books.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class AppComponent {
  public readonly title: string = 'Google Books Search';
  public books: BookItem[] = [];
  public searchDone: boolean = false;
  public currentIndex: number = 0;
  public maxResult: number = 20;
  public booksLength: number = 0;
  public isLoadingResult: boolean = false;
  public inputLoader: boolean = false;
  public errorMessage: string = '';
  public searchForm: FormGroup;

  private readonly booksService: BooksService = inject(BooksService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor() {
    this.initializeSearchForm();
    this.setupFormValueListener();
  }

  private initializeSearchForm(): void {
    this.searchForm = new FormGroup({
      query: new FormControl('')
    });
  }

  private setupFormValueListener(): void {
    this.searchForm
      .get('query')
      ?.valueChanges.pipe(
        filter((query: string | null) => typeof query === 'string' && query.length >= 3),
        distinctUntilChanged(),
        debounceTime(400),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((query: string) => {
        this.private_resetSearch();
        this.private_search(query, 0);
      });
  }

  public nextBtn(event?: Event): void {
    event?.preventDefault();
    if (this.booksLength >= this.maxResult) {
      this.isLoadingResult = true;
      this.currentIndex += this.maxResult;
      this.private_search(this.searchForm.get('query')?.value || '', this.currentIndex);
      window.scrollTo(0, 150);
    }
  }

  public prevBtn(event?: Event): void {
    event?.preventDefault();
    if (this.currentIndex !== 0) {
      this.isLoadingResult = true;
      this.currentIndex -= this.maxResult;
      this.private_search(this.searchForm.get('query')?.value || '', this.currentIndex);
      window.scrollTo(0, 150);
    }
  }

  private private_resetSearch(): void {
    this.isLoadingResult = true;
    this.currentIndex = 0;
    this.inputLoader = true;
    this.errorMessage = '';
  }

  private private_search(query: string, startIndex: number = 0): void {
    this.booksService
      .searchBooks(query, this.maxResult, startIndex)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => {
          this.inputLoader = false;
          this.books = data && data.items ? data.items : [];
          this.booksLength = this.books.length;
          this.searchDone = true;
          this.isLoadingResult = false;
          this.errorMessage = '';
        },
        error: (error) => {
          this.inputLoader = false;
          this.isLoadingResult = false;
          this.searchDone = false;
          this.errorMessage = error.message || 'An error occurred while searching for books';
          console.error('Search error:', error);
        }
      });
  }
}
