/*
  Warnings:

  - You are about to drop the column `used` on the `OtpVerification` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OtpVerification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_OtpVerification" ("code", "createdAt", "email", "expiresAt", "id") SELECT "code", "createdAt", "email", "expiresAt", "id" FROM "OtpVerification";
DROP TABLE "OtpVerification";
ALTER TABLE "new_OtpVerification" RENAME TO "OtpVerification";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
