# Migration to MySQL

This document summarizes the changes made to migrate the DeadStock Management Portal to MySQL.

## Changes Made

### 1. Dependencies (`requirements.txt`)
- ✅ Added `pymysql>=1.1.0` (MySQL driver)
- ✅ Removed `psycopg2-binary` (PostgreSQL driver)
- ✅ Removed `aiosqlite==0.19.0` (SQLite driver)

### 2. Configuration (`app/core/config.py`)
- ✅ Changed default `DATABASE_URL` to MySQL format: `mysql+pymysql://user:password@localhost:3306/deadstock`
- ✅ The URL can still be overridden via environment variables in `.env` file

### 3. Database Connection (`app/core/database.py`)
- ✅ Updated comments to reflect MySQL support
- ✅ Made connection database-agnostic with conditional handling for SQLite compatibility
- ✅ MySQL connections work without special arguments

### 4. Backup/Restore (`app/api/v1/backup.py`)
- ✅ Verified compatibility - backup/restore uses JSON format, which is database-agnostic
- ✅ Restore function works with MySQL's foreign key constraints (models have cascade deletes)

### 5. Documentation (`README.md`)
- ✅ Updated prerequisites to include MySQL 8.0+ or MariaDB 10.3+
- ✅ Added MySQL setup instructions
- ✅ Updated environment variables section with MySQL connection string format

## Setup Instructions

### 1. Install MySQL
Make sure MySQL 8.0+ or MariaDB 10.3+ is installed and running on your system.

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

**macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Windows:**
Download and install MySQL from https://dev.mysql.com/downloads/mysql/

### 2. Create Database
```bash
# Using MySQL command line
mysql -u root -p
CREATE DATABASE deadstock CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Or using command directly:
mysql -u root -p -e "CREATE DATABASE deadstock CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

**Important:** Use `utf8mb4` character set to support full Unicode including emojis.

### 3. Configure Environment Variables
Create a `.env` file in the `backend` directory:
```
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/deadstock
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGINS=http://localhost:3000,http://localhost:3001
```

Replace:
- `username` with your MySQL username (e.g., `root`)
- `password` with your MySQL password
- `localhost:3306` with your MySQL host and port if different

### 4. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 5. Initialize Database
```bash
python seed_data.py
```

### 6. Start the Application
```bash
# Linux/macOS
./start.sh

# Windows
start.bat
```

## Connection String Format

MySQL connection strings with SQLAlchemy follow this format:
```
mysql+pymysql://[user[:password]@][host][:port][/database][?parameters]
```

Examples:
- Local: `mysql+pymysql://root:password@localhost:3306/deadstock`
- Remote: `mysql+pymysql://user:pass@example.com:3306/deadstock`
- With SSL: `mysql+pymysql://user:pass@host:3306/deadstock?ssl_disabled=false`

**Note:** The `+pymysql` part tells SQLAlchemy to use the PyMySQL driver. You can also use `mysqlclient` by changing to `mysql://` and installing `mysqlclient` package instead.

## Features Verified

✅ All database operations work with MySQL
✅ Backup/restore functionality (JSON-based, database-agnostic)
✅ Foreign key constraints and cascade deletes
✅ Transactions and rollbacks
✅ All API endpoints
✅ Seed data script
✅ Unicode support (utf8mb4)

## MySQL-Specific Considerations

### Character Set
- The database is created with `utf8mb4` character set for full Unicode support
- This is important for storing international characters and emojis

### Foreign Keys
- MySQL has strict foreign key checking enabled by default
- The models have proper cascade deletes configured
- All foreign key relationships are properly defined

### Transactions
- MySQL supports transactions (InnoDB engine)
- All database operations use proper transaction handling
- Rollbacks work correctly on errors

## Notes

- The code is backward compatible - it will still work with SQLite or PostgreSQL if you use their respective connection strings
- All SQLAlchemy ORM queries are database-agnostic and work with MySQL, PostgreSQL, and SQLite
- The backup/restore feature uses JSON format, so backups from any database can be restored to MySQL and vice versa
- PyMySQL is a pure Python MySQL client, making it easy to install without system dependencies

## Troubleshooting

### Connection Issues
- Verify MySQL is running: `sudo systemctl status mysql` (Linux) or `brew services list` (macOS)
- Test connection: `mysql -u root -p`
- Check firewall settings if connecting to remote database
- Verify credentials in `.env` file
- Ensure MySQL server is listening on the correct port (default: 3306)

### Permission Issues
- Ensure the database user has CREATE, SELECT, INSERT, UPDATE, DELETE permissions
- Grant permissions: `GRANT ALL PRIVILEGES ON deadstock.* TO 'username'@'localhost';`
- For production, create a dedicated user with appropriate permissions
- Flush privileges: `FLUSH PRIVILEGES;`

### Character Encoding Issues
- Ensure database is created with `utf8mb4` character set
- Check table character sets: `SHOW CREATE TABLE table_name;`
- Verify connection charset in connection string if needed

### PyMySQL Installation Issues
- If `pymysql` fails to install, ensure you have Python development headers
- On Linux: `sudo apt-get install python3-dev` (Ubuntu/Debian)
- Alternative: Use `mysqlclient` instead (requires MySQL client libraries)

### Migration from Existing Database
1. Export data using the backup feature (JSON export)
2. Set up MySQL database with utf8mb4 character set
3. Restore data using the restore feature

## Alternative: Using mysqlclient

If you prefer `mysqlclient` (C-based, faster) over `pymysql`:

1. Install MySQL client libraries:
   - Ubuntu/Debian: `sudo apt-get install default-libmysqlclient-dev`
   - macOS: `brew install mysql-client`
   - Windows: Download from MySQL website

2. Update `requirements.txt`:
   ```
   mysqlclient>=2.1.0
   ```

3. Update connection string in `.env`:
   ```
   DATABASE_URL=mysql://username:password@localhost:3306/deadstock
   ```
   (Note: no `+pymysql` needed)

