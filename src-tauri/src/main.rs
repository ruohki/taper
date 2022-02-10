#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use once_cell::sync::Lazy;
use std::{env, sync::{Mutex, Arc}};
use tiberius::{Client, Config};
use tokio::net::TcpStream;
use tokio_util::compat::TokioAsyncWriteCompatExt;
use futures::stream::{TryStreamExt};
use rusqlite::{params, Connection, Result};
use serde::{Serialize, Deserialize};

static CONN_STR: Lazy<String> = Lazy::new(|| {
  env::var("TAPER_CONNECTION_STRING").expect("Connection string not found")
});

struct SqliteState(Arc<Mutex<Connection>>);

#[derive(Debug, Serialize, Deserialize)]
struct TapeData {
  id: String,
  // Guid des Tapes
  barcode: Option<String>,
  // Barcode des Tapes
  name: Option<String>,
  // Barcode des Tapes
  capacity: Option<i64>,
  remaining: Option<i64>,
  is_full: Option<bool>,
  is_free: Option<bool>,
  /*
  expirationDate: Date,
  mediaPool: MediaPool
  mediaSet: MediaSet
  mediaType: Type
  */
}


#[tauri::command]
fn query_tape(
  conn: tauri::State<SqliteState>,
  tape_name: String,
) -> Result<TapeData, String> {
  let con = conn.0.lock().unwrap();

  let mut stmt = match con.prepare(format!("SELECT * FROM tape_data WHERE name = '{}'  LIMIT 1", tape_name).as_str()) {
    Ok(stmt) => stmt,
    Err(error) => return Err(error.to_string())
  };

  let mut person_iter = match stmt.query_map([], |row| {
    Ok(TapeData {
      id: row.get(0).unwrap(),
      barcode: row.get(1).ok(),
      name: row.get(2).ok(),
      capacity: row.get(3).ok(),
      remaining: row.get(4).ok(),
      is_full: row.get(5).ok(),
      is_free: row.get(6).ok(),
    })
  }) {
    Ok(iter) => iter,
    Err(error) => return Err(error.to_string())
  };

  match person_iter.next() {
    Some(item) => Ok(item.unwrap()),
    _ => Err("Tape wurde nicht gefunden".to_owned())
  }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
  let config = Config::from_ado_string(&CONN_STR)?;

  let tcp = TcpStream::connect(config.get_addr()).await?;
  tcp.set_nodelay(true)?;

  let mut client = Client::connect(config, tcp.compat_write()).await?;
  let conn = Connection::open_in_memory()?;
  conn.execute(
    r"CREATE TABLE tape_data (
        id              TEXT NOT NULL,
        barcode         TEXT,
        name            TEXT,
        capacity        BIGINT,
        remaining       BIGINT,
        is_full         BOOLEAN,
        is_free         BOOLEAN
    )",
    [],
  );

  let query = r"
    SELECT
    [Tape.tape_mediums].*,
    [Tape.media_families].media_pool_id AS family_pool_id,
    [Tape.media_families].name AS family_name, 
    [Tape.media_families].creation_time AS family_creation_time,
    [Tape.media_families].is_closed AS family_is_closed,
    [Tape.media_families].id AS family_id,
    [Tape.media_pools].id AS pool_id,
    [Tape.media_pools].name AS pool_name, 
    [Tape.media_pools].description AS pool_description, [Tape.media_pools].type AS pool_type
    FROM            [Tape.tape_mediums] INNER JOIN
    [Tape.media_families] ON [Tape.tape_mediums].media_family_id = [Tape.media_families].id INNER JOIN
    [Tape.media_pools] ON [Tape.media_families].media_pool_id = [Tape.media_pools].id
    ";

  let mut stream = client.query(query, &[&1i32]).await?;
  while let Some(item) = stream.try_next().await? {
    if let Some(row) = item.as_row() {
      let id: Option<tiberius::Uuid> = row.get("id");
      let name: Option<&str> = row.get("name");
      let barcode: Option<&str> = row.get("barcode");
      let capacity: Option<i64> = row.get("capacity");
      let remaining: Option<i64> = row.get("remaining");
      let is_full: Option<bool> = row.get("is_full");
      let is_free = capacity.unwrap() == remaining.unwrap();

      conn.execute(
        "INSERT INTO tape_data (id, barcode, name, capacity, remaining, is_full, is_free) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![id.unwrap().to_string(), name.unwrap(), barcode.unwrap(), capacity.unwrap(), remaining.unwrap(), is_full.unwrap(), is_free],
      )?;
      //println!("{:?}", val);
    }
  }

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![query_tape])
    .manage(SqliteState(Arc::new(Mutex::new(conn))))
    .run(tauri::generate_context!())
    .expect("error while running tauri application");

  Ok(())
}
