/*
  Warnings:

  - You are about to alter the column `balance` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "accessCode" TEXT NOT NULL,
    "balance" BIGINT NOT NULL DEFAULT 1000,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "animation" TEXT,
    "ownedTitles" TEXT NOT NULL DEFAULT '[]',
    "ownedAnimations" TEXT NOT NULL DEFAULT '[]'
);
INSERT INTO "new_User" ("accessCode", "animation", "balance", "createdAt", "id", "isAdmin", "ownedAnimations", "ownedTitles", "title", "username") SELECT "accessCode", "animation", "balance", "createdAt", "id", "isAdmin", "ownedAnimations", "ownedTitles", "title", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_accessCode_key" ON "User"("accessCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
