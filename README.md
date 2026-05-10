# Google Books Search

A modern Angular 19 application for searching books using the Google Books API. Built with standalone components, reactive forms, and comprehensive error handling.

## Features

- **Book Search**: Search for books in real-time using the Google Books API
- **Pagination**: Navigate through search results with next/previous buttons
- **Error Handling**: Robust error handling with user-friendly error messages
- **Responsive Design**: Bootstrap 4 UI with responsive layout
- **Modern Angular**: Built with Angular 19 standalone components and new control flow
- **Type Safety**: Fully typed TypeScript implementation
- **Memory Leak Prevention**: Safe subscription management using DestroyRef

## Tech Stack

- **Angular**: 19.2.0
- **TypeScript**: 5.8.3
- **RxJS**: 7.8.1
- **Bootstrap**: 4.3.1
- **Font Awesome**: 4.7.0
- **LESS**: 4.4.0

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Configuration

Update the API key in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  googleBooksApiKey: 'YOUR_API_KEY_HERE'
};
```

For production, update `src/environments/environment.prod.ts` similarly.

### Development Server

Run the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Building

Build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Running End-to-End Tests

Run the end-to-end tests:

```bash
npm run e2e
```

## Project Structure

```
src/
├── app/
│   ├── app.component.ts          # Main component
│   ├── app.component.html        # Template with new control flow
│   ├── app.component.less        # Component styles
│   └── services/
│       ├── books.service.ts      # Books API service
├── environments/
│   ├── environment.ts            # Development environment
│   └── environment.prod.ts       # Production environment
├── assets/
└── index.html
```

## Key Improvements (Latest Version)

### Angular 19 Modernization
- **Standalone Components**: Removed NgModule, using standalone components
- **New Control Flow**: Replaced `*ngIf` and `*ngFor` with `@if` and `@for` blocks
- **Proper Typing**: All variables and functions are fully typed
- **Access Modifiers**: All properties and methods have explicit access modifiers (private/public)

### Architecture Improvements
- **BooksService**: Separated API logic into a dedicated service
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Memory Leak Prevention**: Using `DestroyRef` with `takeUntilDestroyed` operator
- **Reactive Forms**: Proper reactive forms implementation with debounce and distinct filters

### Code Quality
- **LESS Styling**: Organized styles in LESS format with variables
- **Configuration Management**: API key and environment configuration in environment files

## API Reference

The application uses the [Google Books API](https://developers.google.com/books/).

### Books Service Methods

```typescript
searchBooks(
  query: string,
  maxResults: number = 20,
  startIndex: number = 0
): Observable<BooksApiResponse>
```

Searches for books matching the given query.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## License

MIT

## Author

marcinszczerba.com

## Resources

- [Angular Documentation](https://angular.io/docs)
- [Google Books API Documentation](https://developers.google.com/books)
- [RxJS Documentation](https://rxjs.dev)
- [Bootstrap Documentation](https://getbootstrap.com/docs/4.3/)

