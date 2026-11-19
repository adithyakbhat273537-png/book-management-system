
import React, { useState, useEffect } from "react";

import Dashboard from "./components/Dashboard";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";

import "./App.css";

const API_URL = "http://localhost:3000/api/books";

function App() {

    const [books, setBooks] = useState([]);

    const [editingBook, setEditingBook] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState("");

    const [error, setError] = useState("");

    // Show notification
    function notify(message) {
        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 3000);
    }

    // Fetch all books
    async function getBooks() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Unable to retrieve books");
            }

            const data = await response.json();

            setBooks(data);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Load books when component mounts
    useEffect(() => {
        getBooks();
    }, []);

    // Open add form
    function openAddForm() {
        setEditingBook(null);
        setShowForm(true);
    }

    // GET book by ID and open edit form
    async function handleEdit(id) {
        try {
            const response = await fetch(
                `${API_URL}/${encodeURIComponent(id)}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setEditingBook(data);
            setShowForm(true);

        } catch (error) {
            notify(error.message);
        }
    }

    // Add or update book
    async function handleSave(bookData) {

        try {
            const isEditing = Boolean(editingBook);

            const url = isEditing
                ? `${API_URL}/${encodeURIComponent(editingBook.id)}`
                : API_URL;

            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(bookData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            setShowForm(false);
            setEditingBook(null);

            await getBooks();

            notify(
                isEditing
                    ? "Book updated successfully!"
                    : "Book added successfully!"
            );

        } catch (error) {
            notify(error.message);
        }
    }

    // Delete book
    async function handleDelete(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this book?"
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${API_URL}/${encodeURIComponent(id)}`,
                {
                    method: "DELETE"
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            await getBooks();

            notify("Book deleted successfully!");

        } catch (error) {
            notify(error.message);
        }
    }

    return (
        <div className="app">

            {/* Sidebar */}
            <aside className="sidebar">

                <div className="brand">
                    <div className="brand-icon">B</div>
                    <span>BookShelf</span>
                </div>

                <p className="menu-heading">MENU</p>

                <a href="#dashboard" className="nav-item active">
                    <span>▦</span> Dashboard
                </a>

                <a href="#books" className="nav-item">
                    <span>▤</span> All Books
                </a>

                <div className="sidebar-profile">
                    <div className="avatar">A</div>
                    <div>
                        <strong>Admin</strong>
                        <small>Administrator</small>
                    </div>
                </div>

            </aside>


            {/* Main content */}
            <main className="main-content">

                <header className="topbar">

                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back! Manage your book collection.</p>
                    </div>

                    <button
                        className="primary-btn"
                        onClick={openAddForm}
                    >
                        + Add New Book
                    </button>

                </header>


                {/* Dashboard statistics */}
                <Dashboard books={books} />


                {/* Book collection */}
                <section className="books-section" id="books">

                    <div className="section-heading">
                        <div>
                            <h2>Book Collection</h2>
                            <p>Manage and organize your books.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                            <button onClick={getBooks}>
                                Retry
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <p className="loading">Loading books...</p>
                    ) : (
                        <BookList
                            books={books}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}

                </section>

            </main>


            {/* Add / Edit form */}
            {showForm && (
                <BookForm
                    book={editingBook}
                    onSave={handleSave}
                    onClose={() => {
                        setShowForm(false);
                        setEditingBook(null);
                    }}
                />
            )}


            {/* Notification */}
            {toast && (
                <div className="toast">
                    {toast}
                </div>
            )}

        </div>
    );
}

export default App;
