import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BooksService, BookItem } from './services/books.service';
import { of, throwError, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let booksService: jasmine.SpyObj<BooksService>;

  const mockBooks: BookItem[] = [
    {
      id: '1',
      volumeInfo: {
        title: 'Test Book 1',
        authors: ['Author 1'],
        publishedDate: '2023-01-01',
        infoLink: 'http://example.com/1'
      }
    },
    {
      id: '2',
      volumeInfo: {
        title: 'Test Book 2',
        authors: ['Author 2'],
        publishedDate: '2023-02-01',
        infoLink: 'http://example.com/2'
      }
    }
  ];

  // Mock books for pagination tests (need at least 20 to trigger nextBtn)
  const mockBooksForPagination: BookItem[] = Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 1}`,
    volumeInfo: {
      title: `Test Book ${i + 1}`,
      authors: [`Author ${i + 1}`],
      publishedDate: `2023-${String(i + 1).padStart(2, '0')}-01`,
      infoLink: `http://example.com/${i + 1}`
    }
  }));

  beforeEach(async () => {
    const booksServiceSpy = jasmine.createSpyObj('BooksService', ['searchBooks']);
    
    // Set default return value to prevent undefined observable errors
    booksServiceSpy.searchBooks.and.returnValue(of({ items: [], totalItems: 0 }));

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [
        { provide: BooksService, useValue: booksServiceSpy }
      ]
    }).compileComponents();

    booksService = TestBed.inject(BooksService) as jasmine.SpyObj<BooksService>;
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toEqual('Google Books Search');
  });

  it('should initialize with correct default values', () => {
    expect(component.books()).toEqual([]);
    expect(component.searchDone()).toBeFalsy();
    expect(component.currentIndex()).toEqual(0);
    expect(component.maxResult()).toEqual(20);
    expect(component.isLoadingResult()).toBeFalsy();
    expect(component.inputLoader()).toBeFalsy();
    expect(component.errorMessage()).toEqual('');
  });

  it('should initialize the search form with query control', () => {
    expect(component.searchForm).toBeDefined();
    expect(component.searchForm.get('query')).toBeDefined();
  });

  describe('Search functionality', () => {
    it('should fetch books on valid search query', (done) => {
      booksService.searchBooks.and.returnValue(of({ items: mockBooks, totalItems: 2 }));

      component.searchForm.get('query')?.setValue('Angular');

      setTimeout(() => {
        fixture.detectChanges();
        expect(component.books().length).toEqual(2);
        expect(component.searchDone()).toBeTruthy();
        expect(component.isLoadingResult()).toBeFalsy();
        expect(component.errorMessage()).toEqual('');
        done();
      }, 500);
    });

    it('should not search if query is less than 3 characters', (done) => {
      booksService.searchBooks.and.returnValue(of({ items: mockBooks, totalItems: 2 }));

      component.searchForm.get('query')?.setValue('ab');

      setTimeout(() => {
        fixture.detectChanges();
        expect(booksService.searchBooks).not.toHaveBeenCalled();
        done();
      }, 500);
    });

    it('should handle search errors properly', (done) => {
      const errorMessage = 'Search failed';
      booksService.searchBooks.and.returnValue(throwError(() => new Error(errorMessage)));
      spyOn(console, 'error');

      component.searchForm.get('query')?.setValue('Angular');

      setTimeout(() => {
        fixture.detectChanges();
        expect(component.errorMessage()).toContain('Search failed');
        expect(component.isLoadingResult()).toBeFalsy();
        expect(component.searchDone()).toBeFalsy();
        done();
      }, 500);
    });

    it('should set correct book length', (done) => {
      booksService.searchBooks.and.returnValue(of({ items: mockBooks, totalItems: 2 }));

      component.searchForm.get('query')?.setValue('Angular');

      setTimeout(() => {
        fixture.detectChanges();
        expect(component.booksLength()).toEqual(2);
        done();
      }, 500);
    });

    it('should handle empty search results', (done) => {
      booksService.searchBooks.and.returnValue(of({ items: undefined, totalItems: 0 }));

      component.searchForm.get('query')?.setValue('NonexistentBook123456');

      setTimeout(() => {
        fixture.detectChanges();
        expect(component.books()).toEqual([]);
        expect(component.booksLength()).toEqual(0);
        expect(component.searchDone()).toBeTruthy();
        done();
      }, 500);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      booksService.searchBooks.and.returnValue(of({ items: mockBooksForPagination, totalItems: 20 }));
      component.books.set(mockBooksForPagination);
      component.searchDone.set(true);
      component.currentIndex.set(0);
      component.searchForm.get('query')?.setValue('Angular');
    });

    it('should increase currentIndex on nextBtn when available', () => {
      component.nextBtn();
      expect(component.currentIndex()).toEqual(20);
    });

    it('should decrease currentIndex on prevBtn', () => {
      component.currentIndex.set(20);
      component.prevBtn();
      expect(component.currentIndex()).toEqual(0);
    });

    it('should not go below 0 on prevBtn', () => {
      component.currentIndex.set(0);
      component.prevBtn();
      expect(component.currentIndex()).toEqual(0);
    });

    it('should call searchBooks and update currentIndex when navigating', () => {
      component.nextBtn();
      expect(component.currentIndex()).toEqual(20);
      expect(booksService.searchBooks).toHaveBeenCalled();
    });
  });
});
