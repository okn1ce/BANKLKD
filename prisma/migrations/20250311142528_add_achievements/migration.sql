-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_UserAchievements" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserAchievements_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievement" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserAchievements_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserAchievements_AB_unique" ON "_UserAchievements"("A", "B");

-- CreateIndex
CREATE INDEX "_UserAchievements_B_index" ON "_UserAchievements"("B");
