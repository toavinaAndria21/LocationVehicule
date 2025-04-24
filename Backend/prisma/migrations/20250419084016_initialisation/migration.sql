-- CreateTable
CREATE TABLE "Location" (
    "num_loc" SERIAL NOT NULL,
    "nom_loc" TEXT NOT NULL,
    "design_voiture" TEXT NOT NULL,
    "nombre_de_jours" INTEGER NOT NULL,
    "taux_journalier" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("num_loc")
);
