/*
  Warnings:

  - A unique constraint covering the columns `[likeId]` on the table `CommentLike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[likeId]` on the table `PostLike` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_likeId_key" ON "CommentLike"("likeId");

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_likeId_key" ON "PostLike"("likeId");
