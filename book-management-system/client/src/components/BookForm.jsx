
import React, { useEffect, useState } from "react";

function BookForm({ book, onSave, onClose }) {

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [price, setPrice] = useState("");

    const [error, setError] = useState("");

    // Load existing book information
    useEffect(() => {

        if (book) {
            setTitle(book.title);
            setAuthor(book.author);
            setPrice(String(book.price));
        } else {
            setTitle("");
            setAuthor("");
            setPrice("");
        }

    }, [book]);

    function handleSubmit(event) {

        event.preventDefault();

        if (
            !title.trim() ||
            !author.trim() ||
            price.trim() === "" ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0
        ) {
            setError("Please enter valid book details.");
            return;
        }

        setError("");

        onSave({
            title: title.trim(),
            author: author.trim(),
            price: Number(price)
        });
    }

    return (
        <div className="modal-overlay" onClick={onClose}>

            <div
                className="modal"
                onClick={event => event.stopPropagation()}
            >

                <div className="modal-header">

                    <div>
                        <h2>
                            {book ? "Update Book" : "Add New Book"}
                        </h2>

                        <p>Enter your book information below.</p>
                    </div>

                    <button
                        className="close-btn"
                        onClick={onClose}
                        type="button"
                    >
                        ×
                    </button>

                </div>


                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Book Title</label>

                        <input
                            type="text"
                            placeholder="Enter book title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Author Name</label>

                        <input
                            type="text"
                            placeholder="Enter author name"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Book Price (₹)</label>

                        <input
                            type="number"
                            placeholder="Enter book price"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            required
                        />

                    </div>


                    {error && (
                        <p className="form-error">{error}</p>
                    )}


                    <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                        >
                            {book ? "Update Book" : "Save Book"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default BookForm;
