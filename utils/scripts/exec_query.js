import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Inizializzo il client di SARP

export const get_as = (millis) => {
    const n = new Date(millis);
    let year = n.getFullYear();
    const month = n.getMonth() + 1;
    if (month >= 1 && month <= 8)
        year--;
    return year;
}

(async function () {
    //const result = await prisma.$queryRaw`SELECT * FROM Insegnamenti where idDocente=648`;
    // const result = await prisma.$queryRaw`UPDATE SELECT * FROM Materia where id=32`;
    // const result = await prisma.$queryRaw`UPDATE Insegnamenti SET code_classroom="-------" where idDocente=648 and idMateria=32`;

    // let presenze_millis = new Set();
    // const presenze = await prisma.$queryRaw`SELECT dataPresenza FROM pcto_Presenza`;
    // presenze.forEach(d => {
    //     presenze_millis.add(new Date(d.dataPresenza).getTime());
    // });
    // //Array di date uniche di presenze pcto
    // presenze_millis = Array.from(presenze_millis);

    // presenze_millis.forEach(async d => {
    //     const result = await prisma.$queryRaw`UPDATE pcto_Presenza SET 'as' = ${get_as(d)} WHERE dataPresenza = ${d}`;
    // });

    const insegnamenti = await prisma.$queryRaw`select * from insegnamenti where idMateria=9 or idMateria=48`;
    for (let ins of insegnamenti) {
        console.log(`DELETEING ${ins.id}-${ins.idMateria}-${ins.idClasse}`)
        const result = await prisma.$queryRaw`DELETE from PDP where idInsegnamento = ${ins.id}`;
    }


})();

