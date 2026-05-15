import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BooksService, BooksApiResponse } from './books.service';
import { environment } from '../../environments/environment';

describe('BooksService', () => {
  let service: BooksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BooksService]
    });

    service = TestBed.inject(BooksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search books with correct URL', () => {
    const mockResponse: BooksApiResponse = {
      items: [],
      totalItems: 0
    };

    const query = 'Angular';
    const maxResults = 20;
    const startIndex = 0;

    service.searchBooks(query, maxResults, startIndex).subscribe();

    const expectedUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${environment.googleBooksApiKey}&maxResults=${maxResults}&startIndex=${startIndex}`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should use default parameters for searchBooks', () => {
    const mockResponse: BooksApiResponse = {
      items: [],
      totalItems: 0
    };

    const query = 'Angular';

    service.searchBooks(query).subscribe();

    const expectedUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${environment.googleBooksApiKey}&maxResults=20&startIndex=0`;
    const req = httpMock.expectOne(expectedUrl);
    req.flush(mockResponse);
  });

  it('should handle HTTP errors', (done) => {
    const query = 'Angular';

    service.searchBooks(query).subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.message).toContain('Server error');
        expect(error.message).toContain('404');
        done();
      }
    });

    const req = httpMock.expectOne((request) => request.url.includes(query));
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle network errors', (done) => {
    const query = 'Angular';

    service.searchBooks(query).subscribe({
      next: () => fail('should have failed with network error'),
      error: (error) => {
        expect(error.message).toBeDefined();
        done();
      }
    });

    const req = httpMock.expectOne((request) => request.url.includes(query));
    req.error(new ProgressEvent('error'));
  });
});
