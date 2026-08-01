import sqlite3

conn = sqlite3.connect('hte_platform.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("SELECT * FROM colleges WHERE college_name LIKE '%COEP%' OR college_name LIKE '%Veermata%' OR college_name LIKE '%VJTI%' OR college_name LIKE '%College of Engineering%'")
rows = cursor.fetchall()
print(f"FOUND {len(rows)} COLLEGES:")
for r in rows:
    print(dict(r))
