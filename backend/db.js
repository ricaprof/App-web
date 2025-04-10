import mysql from 'mysql2';

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'web'
});     


db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Conectado a base de dados');
    }
});