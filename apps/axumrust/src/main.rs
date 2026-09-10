use axum::{routing::get, Router};
use sqlx::postgres::PgPoolOptions;
use std::env;

#[tokio::main]
async fn main() {
    dotenvy::from_filename("../../.env").ok();

    let database_url =
        env::var("RUST_DATABASE_URL")
            .expect("RUST_DATABASE_URL is not set");

    let port =
        env::var("RUST_PORT")
            .unwrap_or_else(|_| "2606".to_string());

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await
        .expect("Failed to connect to PostgreSQL");

    let app = Router::new()
        .route("/health", get(health))
        .with_state(pool);

    let listener =
        tokio::net::TcpListener::bind(
            format!("0.0.0.0:{port}")
        )
        .await
        .unwrap();

    println!("Rust API running on {port}");

    axum::serve(listener, app)
        .await
        .unwrap();
}

async fn health() -> &'static str {
    "OK"
}