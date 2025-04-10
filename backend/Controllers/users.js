import {db} from '../db.js';



export const deleteTransaction = (req, res) => {

    console.log("Recebida requisição para remover transação", req.params.id);
    const id = req.params.id; // Captura o ID passado na URL
    db.query("DELETE FROM gastos WHERE id_gastos = ?", [id], (error, results) => {
        if (error) {
            console.error("Erro ao deletar transação:", error);
            res.status(500).json({ error: "Erro ao deletar transação" });
        } else {
            console.log("Transação deletada com sucesso");
            res.json({ success: true, message: "Transação deletada com sucesso" });
        }
    });
    console.log("Transação deletada com sucesso");
    

}


//Importar agenda-financeira para o BD
export const addTransaction = (req, res) => {
    
    // Verifica se o corpo da requisição contém os campos necessários
    console.log("Corpo da requisição:", req.body);

    if (!req.body || !req.body.valor || !req.body.descricao || !req.body.date || !req.body.categoria) {
        console.error("Corpo da requisição inválido:", req.body);
        return res.status(400).json({ error: "Corpo da requisição inválido" });
    }
    
    
    const { descricao, date, categoria, tipo } = req.body;
    let valor = req.body.valor;

    //Verifica se é entrada ou saída e coloca o sinal certo
    // Se o tipo não for 'income' ou 'expense', retorna um erro, só é possivel alterando o Frontend
    if (tipo !== "income" && tipo !== "expense") {
        console.error("Tipo inválido:", tipo);
        return res.status(400).json({ error: "Tipo inválido. Deve ser 'income' ou 'expense'" });
    }

    if (tipo === "income") {
        // valor vai ser sempre maior que 0
        if (valor <= 0) {
            valor = valor * -1;
        }
    } else if (tipo === "expense") {
        // valor menor que 0
        if (valor >= 0) {
            valor = valor * -1;
        }

        // Se o tipo não for 'income' ou 'expense', retorna um erro
    if (tipo !== "income" && tipo !== "expense") {
        console.error("Tipo inválido:", tipo);
        return res.status(400).json({ error: "Tipo inválido. Deve ser 'income' ou 'expense'" });
    }

    } else {
        console.error("Tipo inválido:", tipo);
        return res.status(400).json({ error: "Tipo inválido. Deve ser 'income' ou 'expense'" });
    }
        
    // Extrai os dados do corpo da requisição
    console.log(`Recebida requisição para adicionar transação: ${req.body}`);

    db.query("INSERT INTO gastos (valor, descricao, data, categoria) VALUES (?, ?, ?, ?)", [ valor, descricao, date, categoria], (error, results) => {
        if (error) {
            console.error("Erro ao adicionar transação:", error);
            res.status(500).json({ error: "Erro ao adicionar transação" });
        } else {
            console.log("Transação adicionada com sucesso");
            res.json({ success: true, message: "Transação adicionada com sucesso" });
        }
    });
}

export const getTransaction = (req, res) => {
    // Verifica se o corpo da requisição contém os campos necessários
    console.log("Recebida requisição para listar transações");
    console.log("Corpo da requisição:", req.body);
    const { startDate, endDate } = req.query;
    const id = req.params.id; // Captura o ID passado na URL


    let query = "SELECT * FROM gastos";
    const params = [];
  
    if (startDate && endDate) {
      query += " WHERE data BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }
  
    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Erro ao buscar transações:", err);
        return res.status(500).json({ error: "Erro ao buscar transações" });
      }
      res.json(results);
})

    


}

export const getIncome = (req, res) => {
    console.log("Recebida requisição para calcular a soma das transações de entrada (income)");

    db.query("SELECT SUM(valor) AS totalIncome FROM gastos WHERE valor > 0", (error, results) => {
        if (error) {
            console.error("Erro ao calcular a soma das transações de entrada:", error);
            res.status(500).json({ error: "Erro ao calcular a soma das transações de entrada" });
        } else {
            console.log("Soma das transações de entrada calculada com sucesso", results[0].totalIncome);
            res.json({ totalIncome: results[0].totalIncome });
        }
    });
};



export const getExpense = (req, res) => {
    console.log("Recebida requisição para calcular a soma das transações de saída (expense)");

    db.query("SELECT SUM(valor) AS totalExpense FROM gastos WHERE valor < 0", (error, results) => {
        if (error) {
            console.error("Erro ao calcular a soma das transações de saída:", error);
            res.status(500).json({ error: "Erro ao calcular a soma das transações de saída" });
        } else {
            console.log("Soma das transações de saída calculada com sucesso", results[0].totalExpense);
            res.json({ totalExpense: results[0].totalExpense });
        }
    });
};

export const updateTransaction = (req, res) => {
    const id_gastos = req.params.id; // Captura o ID passado na URL
    const { valor, descricao, data, categoria } = req.body;
    console.log(`Recebida requisição para atualizar transação com ID: ${id_gastos}`);
    console.log(`Dados da transação: ${valor}, ${descricao}, ${data}, ${categoria}`);
    db.query("UPDATE gastos SET valor = ?, descricao = ?, data = ?, categoria = ? WHERE id_gastos = ?", [valor, descricao, data, categoria, id_gastos], (error, results) => {
        if (error) {
            console.error("Erro ao atualizar transação:", error);
            res.status(500).json({ error: "Erro ao atualizar transação" });
        }
     else {
        console.log("Transação atualizada com sucesso");
        res.json({ success: true, message: "Transação atualizada com sucesso" });
    }
    })};

export const getUser = (req, res) => {
    const id = req.params.id; // Captura o ID passado na URL
    console.log(`Recebida requisição para listar usuário com ID: ${id}`);
    db.query("SELECT * FROM usuarios WHERE id_usuarios = ?", [id], (error, results) => {
        if (error) {
            console.error("Erro ao consultar usuário:", error);
            res.status(500).json({ error: "Erro ao consultar usuário" });
        } else {
            if (results.length > 0) {
                console.log("Usuário encontrado:", results[0]);
                res.json(results[0]);
            }   
        }
    })
}

export const getUsers = (req, res) => {
    console.log("Recebida requisição para listar usuários");
    db.query('SELECT * FROM usuarios', (error, results) => {
        if (error) {
            console.log("Erro na consulta de usuários:", error);
        } else {
            console.log("Consulta de usuários bem-sucedida");
            res.send(results);
        }
    });

    
};

export const deleteUser = (req, res) => {
    const id = req.params.id; // Captura o ID passado na URL
    console.log(`Recebida requisição para deletar usuário com ID: ${id}`);

    db.query("DELETE FROM usuarios WHERE id_usuarios = ?", [id], (error, results) => {
        if (error) {
            console.error("Erro ao deletar usuário:", error);
            res.status(500).json({ error: "Erro ao deletar usuário" });
        } else {
            console.log("Usuário deletado com sucesso");
            res.json({ success: true, message: "Usuário deletado com sucesso" });
        }
    });
};

export const createUser = (req, res) => {
    const { name, surname, status, email } = req.body;
    console.log(`Recebida requisição para criar usuário: ${name} ${surname} ${status} ${email}`);

    db.query("INSERT INTO usuarios (name, surname, status, email) VALUES (?, ?, ?, ?)", [name, surname, status, email], (error, results) => {
        if (error) {
            console.error("Erro ao criar usuário:", error);
            res.status(500).json({ error: "Erro ao criar usuário" });
        } else {
            console.log("Usuário criado com sucesso");
            res.json({ success: true, message: "Usuário criado com sucesso" });
        }
    });
};

export const updateUser = (req, res) => {
    const { id_usuarios ,name, surname, status, email } = req.body;
    console.log(req.body);
    console.log(`Recebida requisição para atualizar usuário com ID: ${id_usuarios} para ${name} ${surname} ${status} ${email}`);

    db.query("UPDATE usuarios SET name = ?, surname = ?, status = ?, email = ? WHERE id_usuarios = ?", [name, surname, status, email, id_usuarios], (error, results) => {
        if (error) {
            console.error("Erro ao atualizar usuário:", error);
            res.status(500).json({ error: "Erro ao atualizar usuário" });
        } else {
            console.log("Usuário atualizado com sucesso");
            res.json({ success: true, message: "Usuário atualizado com sucesso" });
        }
    });
}
