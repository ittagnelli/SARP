import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Inizializzo il client di SARP

(async function () {
    const result = await prisma.$queryRaw`SELECT * FROM Insegnamenti where idDocente=648`;
    // const result = await prisma.$queryRaw`UPDATE SELECT * FROM Materia where id=32`;
    // const result = await prisma.$queryRaw`UPDATE Insegnamenti SET code_classroom="-------" where idDocente=648 and idMateria=32`;
    

    console.log(result)
})();

