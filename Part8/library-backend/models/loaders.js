import DataLoader from "dataloader";
import Book from "./book.js";
 const bookLoader = new DataLoader(async (authorIds) => {
  const books = await Book.find({author: { $in: authorIds } });
  return authorIds.map(
    (authorId) => books.filter((b) => b.author.toString() === authorId.toString()).length
  );
});
export default  bookLoader;     