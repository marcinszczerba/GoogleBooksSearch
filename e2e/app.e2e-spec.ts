import { GoogleBooksPage } from './app.po';

describe('google-books App', () => {
  let page: GoogleBooksPage;

  beforeEach(() => {
    page = new GoogleBooksPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
