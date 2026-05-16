import { Component, DestroyRef, inject, signal, computed } from '@angular/core';
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
  public title: string = 'Google Books Search';
  public books = signal<BookItem[]>([]);
  public searchDone = signal<boolean>(false);
  public currentIndex = signal<number>(0);
  public maxResult = signal<number>(20);
  public isLoadingResult = signal<boolean>(false);
  public inputLoader = signal<boolean>(false);
  public errorMessage = signal<string>('');
  
  // Computed signal - automatycznie obliczana długość tablic
  public readonly booksLength = computed(() => this.books().length);
  
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
    if (this.booksLength() >= this.maxResult()) {
      this.isLoadingResult.set(true);
      this.currentIndex.update(index => index + this.maxResult());
      this.private_search(this.searchForm.get('query')?.value || '', this.currentIndex());
      window.scrollTo(0, 150);
    }
  }

  public prevBtn(event?: Event): void {
    event?.preventDefault();
    if (this.currentIndex() !== 0) {
      this.isLoadingResult.set(true);
      this.currentIndex.update(index => index - this.maxResult());
      this.private_search(this.searchForm.get('query')?.value || '', this.currentIndex());
      window.scrollTo(0, 150);
    }
  }

  private private_resetSearch(): void {
    this.isLoadingResult.set(true);
    this.currentIndex.set(0);
    this.inputLoader.set(true);
    this.errorMessage.set('');
  }

  private private_search(query: string, startIndex: number = 0): void {
    this.booksService
      .searchBooks(query, this.maxResult(), startIndex)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => {
          this.inputLoader.set(false);
          this.books.set(data && data.items ? data.items : []);
          this.searchDone.set(true);
          this.isLoadingResult.set(false);
          this.errorMessage.set('');
        },
        error: (error) => {
          this.inputLoader.set(false);
          this.isLoadingResult.set(false);
          this.searchDone.set(false);
          this.errorMessage.set(error.message || 'An error occurred while searching for books');
          console.error('Search error:', error);
        }
      });
  }
}
