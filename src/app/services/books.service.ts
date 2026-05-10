import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface BookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publishedDate: string;
    infoLink: string;
  };
}

export interface BooksApiResponse {
  items?: BookItem[];
  totalItems: number;
}

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private readonly apiUrl: string = 'https://www.googleapis.com/books/v1/volumes';
  private readonly apiKey: string = environment.googleBooksApiKey;

  constructor(private readonly http: HttpClient) {}

  public searchBooks(
    query: string,
    maxResults: number = 20,
    startIndex: number = 0
  ): Observable<BooksApiResponse> {
    const url: string = `${this.apiUrl}?q=${query}&key=${this.apiKey}&maxResults=${maxResults}&startIndex=${startIndex}`;
    
    return this.http.get<BooksApiResponse>(url).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string = 'An error occurred while fetching books';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.statusText}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
