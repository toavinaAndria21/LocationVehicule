import prisma from "../config/prisma"

interface LocationData {
    nom_loc: string;
    design_voiture: string;
    nombre_de_jours: number;
    taux_journalier: number;
  }

export const getLocation = async () => {
    return await prisma.location.findMany();
}

export const getLocationById = async (num_loc: number) => {
  return await prisma.location.findUnique({
    where: { num_loc },
  });
};
  
export const addLocation = async (data: LocationData) => {
    const newLocation = await prisma.location.create({
      data: {
        nom_loc: data.nom_loc,
        design_voiture: data.design_voiture,
        nombre_de_jours: data.nombre_de_jours,
        taux_journalier: data.taux_journalier,
        },
    });
  
    return newLocation;
};

export const updateLocation = async (id: number, data: LocationData) => {
 
   const updatedLocation = await prisma.location.update({
    where: { num_loc: id },
    data: {
        nom_loc: data.nom_loc,
        design_voiture: data.design_voiture,
        nombre_de_jours: data.nombre_de_jours,
        taux_journalier: data.taux_journalier,
        },
   })
  
    return updatedLocation;
  };
  
export const deleteLocationById = async (num_loc: number) => {
    return await prisma.location.delete({ where: { num_loc } })
  }
  
