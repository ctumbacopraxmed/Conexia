/*
  Warnings:

  - A unique constraint covering the columns `[ORDEN_SERVICIO]` on the table `AUTORIZACIONWEB` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AUTORIZACIONWEB_ORDEN_SERVICIO_key" ON "AUTORIZACIONWEB"("ORDEN_SERVICIO");
