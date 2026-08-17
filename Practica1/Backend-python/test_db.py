from app.config import get_connection

conn = get_connection()
print("Conexión exitosa")
conn.close()