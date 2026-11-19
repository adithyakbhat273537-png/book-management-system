
import React, { useState } from "react";

function BookList({ books, onEdit, onDelete }) {

    const [search, setSearch] = useState("");

    const filteredBooks = books.filter(book => {

        const term = search.toLowerCase().trim();

        return (
            book.title.toLowerCase().includes(term) ||
            book.author.toLowerCase().includes(term) ||
            book.id.toLowerCase().includes(term)
        );
    });

    return (
        <div>

            <div className="list-toolbar">

                <div>
                    <strong>All Books</strong>
                    <span className="book-count">
                        {filteredBooks.length} books
                    </span>
                </div>

                <input
                    className="search-input"
                    type="text"
                    placeholder="Search title or author..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

            </div>


            <div className="table-wrapper">

                <table>

                    <thead>
                        <tr>
                            <th>BOOK ID</th>
                            <th>TITLE</th>
                            <th>AUTHOR</th>
                            <th>PRICE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>


                    <tbody>

                        {filteredBooks.length === 0 ? (

                            <tr>
                                <td colSpan="5" className="empty">
                                    {books.length === 0
                                        ? "No books available. Add your first book!"
                                        : "No matching books found."}
                                </td>
                            </tr>

                        ) : (

                            filteredBooks.map(book => (

                                <tr key={book.id}>

                                    <td className="book-id">
                                        {book.id.slice(0, 8)}
                                    </td>

                                    <td className="book-title">
                                        {book.title}
                                    </td>

                                    <td>{book.author}</td>

                                    <td className="book-price">
                                        ₹{Number(book.price).toFixed(2)}
                                    </td>

                                    <td>

                                        <div className="actions">

                                            <button
                                                className="edit-btn"
                                                onClick={() => onEdit(book.id)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() => onDelete(book.id)}
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default BookList;
