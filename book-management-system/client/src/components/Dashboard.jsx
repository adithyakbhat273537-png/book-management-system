
import React from "react";

function Dashboard({ books }) {

    const totalBooks = books.length;

    const totalAuthors = new Set(
        books.map(book => book.author.toLowerCase())
    ).size;

    const totalValue = books.reduce(
        (total, book) => total + Number(book.price),
        0
    );

    return (
        <section className="stats-grid" id="dashboard">

            <div className="stat-card">
                <div className="stat-icon purple">▤</div>
                <p>Total Books</p>
                <h2>{totalBooks}</h2>
                <small>Books in collection</small>
            </div>

            <div className="stat-card">
                <div className="stat-icon blue">◉</div>
                <p>Total Authors</p>
                <h2>{totalAuthors}</h2>
                <small>Unique authors</small>
            </div>

            <div className="stat-card">
                <div className="stat-icon green">₹</div>
                <p>Collection Value</p>
                <h2>
                    ₹{totalValue.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </h2>
                <small>Total book prices</small>
            </div>

        </section>
    );
}

export default Dashboard;
