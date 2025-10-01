var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import 'dotenv/config';
import { db } from '../db';
import { sql } from 'drizzle-orm';
console.log('🔧 Migration script loaded');
/**
 * Migration script for authentication system
 * Applies database schema changes for production-ready auth
 */
function runMigration() {
    return __awaiter(this, void 0, void 0, function () {
        var tables, userColumns, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🔄 Starting migration: Auth System');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 20, , 21]);
                    // Check current schema
                    console.log('🔍 Checking current database schema...');
                    return [4 /*yield*/, db.all(sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT name FROM sqlite_master WHERE type='table'"], ["SELECT name FROM sqlite_master WHERE type='table'"]))))];
                case 2:
                    tables = _a.sent();
                    console.log('Current tables:', tables.map(function (t) { return t.name; }));
                    // Drop existing tables in correct order (reverse dependency order)
                    console.log('🔄 Dropping existing tables...');
                    return [4 /*yield*/, db.run(sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["PRAGMA foreign_keys = OFF"], ["PRAGMA foreign_keys = OFF"]))))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.run(sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["DROP TABLE IF EXISTS sessions"], ["DROP TABLE IF EXISTS sessions"]))))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.run(sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["DROP TABLE IF EXISTS users"], ["DROP TABLE IF EXISTS users"]))))];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db.run(sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["DROP TABLE IF EXISTS companies"], ["DROP TABLE IF EXISTS companies"]))))];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db.run(sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["PRAGMA foreign_keys = ON"], ["PRAGMA foreign_keys = ON"]))))];
                case 7:
                    _a.sent();
                    console.log('✅ Dropped existing tables');
                    // Create companies table for admin management
                    return [4 /*yield*/, db.run(sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      CREATE TABLE companies (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        name TEXT NOT NULL,\n        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),\n        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))\n      )\n    "], ["\n      CREATE TABLE companies (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        name TEXT NOT NULL,\n        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),\n        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))\n      )\n    "]))))];
                case 8:
                    // Create companies table for admin management
                    _a.sent();
                    console.log('✅ Created companies table');
                    // Create production-ready users table
                    console.log('🔄 Creating users table...');
                    return [4 /*yield*/, db.run(sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n      CREATE TABLE users (\n        id TEXT PRIMARY KEY,\n        name TEXT NOT NULL,\n        email TEXT UNIQUE,\n        phone TEXT NOT NULL UNIQUE,\n        password_hash TEXT NOT NULL,\n        role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),\n        company_id INTEGER,\n        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),\n        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),\n        FOREIGN KEY (company_id) REFERENCES companies(id)\n      )\n    "], ["\n      CREATE TABLE users (\n        id TEXT PRIMARY KEY,\n        name TEXT NOT NULL,\n        email TEXT UNIQUE,\n        phone TEXT NOT NULL UNIQUE,\n        password_hash TEXT NOT NULL,\n        role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),\n        company_id INTEGER,\n        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),\n        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),\n        FOREIGN KEY (company_id) REFERENCES companies(id)\n      )\n    "]))))];
                case 9:
                    _a.sent();
                    console.log('✅ Created users table with proper schema');
                    return [4 /*yield*/, db.all(sql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["PRAGMA table_info(users)"], ["PRAGMA table_info(users)"]))))];
                case 10:
                    userColumns = _a.sent();
                    console.log('🔍 Users table columns:', userColumns.map(function (col) { return "".concat(col.name, " (").concat(col.type, ")"); }));
                    // Create sessions table for session management
                    return [4 /*yield*/, db.run(sql(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n      CREATE TABLE sessions (\n        id TEXT PRIMARY KEY,\n        user_id TEXT NOT NULL,\n        data TEXT NOT NULL,\n        expires_at INTEGER NOT NULL,\n        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),\n        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n      )\n    "], ["\n      CREATE TABLE sessions (\n        id TEXT PRIMARY KEY,\n        user_id TEXT NOT NULL,\n        data TEXT NOT NULL,\n        expires_at INTEGER NOT NULL,\n        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),\n        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n      )\n    "]))))];
                case 11:
                    // Create sessions table for session management
                    _a.sent();
                    console.log('✅ Created sessions table');
                    // Create indexes for better performance
                    return [4 /*yield*/, db.run(sql(templateObject_11 || (templateObject_11 = __makeTemplateObject(["CREATE INDEX idx_users_email ON users(email)"], ["CREATE INDEX idx_users_email ON users(email)"]))))];
                case 12:
                    // Create indexes for better performance
                    _a.sent();
                    return [4 /*yield*/, db.run(sql(templateObject_12 || (templateObject_12 = __makeTemplateObject(["CREATE INDEX idx_users_phone ON users(phone)"], ["CREATE INDEX idx_users_phone ON users(phone)"]))))];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, db.run(sql(templateObject_13 || (templateObject_13 = __makeTemplateObject(["CREATE INDEX idx_users_role ON users(role)"], ["CREATE INDEX idx_users_role ON users(role)"]))))];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, db.run(sql(templateObject_14 || (templateObject_14 = __makeTemplateObject(["CREATE INDEX idx_users_company_id ON users(company_id)"], ["CREATE INDEX idx_users_company_id ON users(company_id)"]))))];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, db.run(sql(templateObject_15 || (templateObject_15 = __makeTemplateObject(["CREATE INDEX idx_sessions_user_id ON sessions(user_id)"], ["CREATE INDEX idx_sessions_user_id ON sessions(user_id)"]))))];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, db.run(sql(templateObject_16 || (templateObject_16 = __makeTemplateObject(["CREATE INDEX idx_sessions_expires_at ON sessions(expires_at)"], ["CREATE INDEX idx_sessions_expires_at ON sessions(expires_at)"]))))];
                case 17:
                    _a.sent();
                    console.log('✅ Created database indexes');
                    // Update trigger for users table
                    return [4 /*yield*/, db.run(sql(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n      CREATE TRIGGER update_users_updated_at\n        AFTER UPDATE ON users\n        FOR EACH ROW\n      BEGIN\n        UPDATE users SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;\n      END\n    "], ["\n      CREATE TRIGGER update_users_updated_at\n        AFTER UPDATE ON users\n        FOR EACH ROW\n      BEGIN\n        UPDATE users SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;\n      END\n    "]))))];
                case 18:
                    // Update trigger for users table
                    _a.sent();
                    // Update trigger for companies table
                    return [4 /*yield*/, db.run(sql(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n      CREATE TRIGGER update_companies_updated_at\n        AFTER UPDATE ON companies\n        FOR EACH ROW\n      BEGIN\n        UPDATE companies SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;\n      END\n    "], ["\n      CREATE TRIGGER update_companies_updated_at\n        AFTER UPDATE ON companies\n        FOR EACH ROW\n      BEGIN\n        UPDATE companies SET updated_at = strftime('%s', 'now') WHERE id = NEW.id;\n      END\n    "]))))];
                case 19:
                    // Update trigger for companies table
                    _a.sent();
                    console.log('✅ Created update triggers');
                    console.log('🎉 Migration completed successfully!');
                    return [3 /*break*/, 21];
                case 20:
                    error_1 = _a.sent();
                    console.error('❌ Migration failed:', error_1);
                    throw error_1;
                case 21: return [2 /*return*/];
            }
        });
    });
}
// Execute migration directly
console.log('🚀 Starting migration script execution...');
runMigration()
    .then(function () {
    console.log('✅ Migration script completed successfully');
    process.exit(0);
})
    .catch(function (error) {
    console.error('❌ Migration script failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
});
export { runMigration };
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
