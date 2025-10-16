// Dados mockados de parâmetros para o dashboard
const mockParametros = [
    {
        tipo_parametro: "Temperatura (°C)",
        estacoes: [
            "Estação Aurora",
            "Estação Boreal",
            "Estação Cobalto",
            "Estação Duna",
            "Estação Éter",
            "Estação Fênix",
            "Estação Gelo",
        ],
        dados: [

            // Estação Aurora
            // 13h
            { datetime: "2025-10-15 13:05", "Estação Aurora": 21.1 },
            { datetime: "2025-10-15 13:20", "Estação Aurora": 21.5 },
            { datetime: "2025-10-15 13:35", "Estação Aurora": 21.9 },
            { datetime: "2025-10-15 13:50", "Estação Aurora": 22.2 },
            // 14h
            { datetime: "2025-10-15 14:10", "Estação Aurora": 22.5 },
            { datetime: "2025-10-15 14:25", "Estação Aurora": 22.8 },
            { datetime: "2025-10-15 14:40", "Estação Aurora": 23.1 },
            { datetime: "2025-10-15 14:55", "Estação Aurora": 23.3 },
            // 15h
            { datetime: "2025-10-15 15:05", "Estação Aurora": 23.6 },
            { datetime: "2025-10-15 15:20", "Estação Aurora": 23.9 },
            { datetime: "2025-10-15 15:35", "Estação Aurora": 24.1 },
            { datetime: "2025-10-15 15:50", "Estação Aurora": 24.3 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Aurora": 24.1 },
            { datetime: "2025-10-15 16:25", "Estação Aurora": 23.8 },
            { datetime: "2025-10-15 16:40", "Estação Aurora": 23.4 },
            { datetime: "2025-10-15 16:55", "Estação Aurora": 23.0 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Aurora": 22.7 },
            { datetime: "2025-10-15 17:20", "Estação Aurora": 22.3 },
            { datetime: "2025-10-15 17:35", "Estação Aurora": 21.9 },
            { datetime: "2025-10-15 17:50", "Estação Aurora": 21.6 },

            // Estação Boreal
            // 13h
            { datetime: "2025-10-15 13:08", "Estação Boreal": 20.3 },
            { datetime: "2025-10-15 13:22", "Estação Boreal": 20.6 },
            { datetime: "2025-10-15 13:38", "Estação Boreal": 20.9 },
            { datetime: "2025-10-15 13:53", "Estação Boreal": 21.1 },
            // 14h
            { datetime: "2025-10-15 14:05", "Estação Boreal": 21.4 },
            { datetime: "2025-10-15 14:20", "Estação Boreal": 21.7 },
            { datetime: "2025-10-15 14:35", "Estação Boreal": 22.0 },
            { datetime: "2025-10-15 14:50", "Estação Boreal": 22.3 },
            // 15h
            { datetime: "2025-10-15 15:05", "Estação Boreal": 22.7 },
            { datetime: "2025-10-15 15:20", "Estação Boreal": 23.0 },
            { datetime: "2025-10-15 15:35", "Estação Boreal": 23.3 },
            { datetime: "2025-10-15 15:50", "Estação Boreal": 23.5 },
            // 16h
            { datetime: "2025-10-15 16:05", "Estação Boreal": 23.4 },
            { datetime: "2025-10-15 16:20", "Estação Boreal": 23.1 },
            { datetime: "2025-10-15 16:35", "Estação Boreal": 22.8 },
            { datetime: "2025-10-15 16:50", "Estação Boreal": 22.4 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Boreal": 22.0 },
            { datetime: "2025-10-15 17:20", "Estação Boreal": 21.6 },
            { datetime: "2025-10-15 17:35", "Estação Boreal": 21.2 },
            { datetime: "2025-10-15 17:50", "Estação Boreal": 20.9 },

            // Estação Cobalto
            // 13h
            { datetime: "2025-10-15 13:10", "Estação Cobalto": 22.1 },
            { datetime: "2025-10-15 13:25", "Estação Cobalto": 22.4 },
            { datetime: "2025-10-15 13:40", "Estação Cobalto": 22.7 },
            { datetime: "2025-10-15 13:55", "Estação Cobalto": 22.9 },
            // 14h
            { datetime: "2025-10-15 14:10", "Estação Cobalto": 23.3 },
            { datetime: "2025-10-15 14:25", "Estação Cobalto": 23.6 },
            { datetime: "2025-10-15 14:40", "Estação Cobalto": 23.8 },
            { datetime: "2025-10-15 14:55", "Estação Cobalto": 24.0 },
            // 15h
            { datetime: "2025-10-15 15:10", "Estação Cobalto": 24.3 },
            { datetime: "2025-10-15 15:25", "Estação Cobalto": 24.6 },
            { datetime: "2025-10-15 15:40", "Estação Cobalto": 24.8 },
            { datetime: "2025-10-15 15:55", "Estação Cobalto": 25.0 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Cobalto": 24.7 },
            { datetime: "2025-10-15 16:25", "Estação Cobalto": 24.3 },
            { datetime: "2025-10-15 16:40", "Estação Cobalto": 23.9 },
            { datetime: "2025-10-15 16:55", "Estação Cobalto": 23.5 },
            // 17h
            { datetime: "2025-10-15 17:10", "Estação Cobalto": 23.1 },
            { datetime: "2025-10-15 17:25", "Estação Cobalto": 22.8 },
            { datetime: "2025-10-15 17:40", "Estação Cobalto": 22.5 },
            { datetime: "2025-10-15 17:55", "Estação Cobalto": 22.2 },


            // Estação Duna
            // 13h
            { datetime: "2025-10-15 13:02", "Estação Duna": 19.8 },
            { datetime: "2025-10-15 13:17", "Estação Duna": 20.1 },
            { datetime: "2025-10-15 13:32", "Estação Duna": 20.3 },
            { datetime: "2025-10-15 13:47", "Estação Duna": 20.5 },
            // 14h
            { datetime: "2025-10-15 14:05", "Estação Duna": 20.8 },
            { datetime: "2025-10-15 14:20", "Estação Duna": 21.0 },
            { datetime: "2025-10-15 14:35", "Estação Duna": 21.3 },
            { datetime: "2025-10-15 14:50", "Estação Duna": 21.5 },
            // 15h
            { datetime: "2025-10-15 15:10", "Estação Duna": 21.8 },
            { datetime: "2025-10-15 15:25", "Estação Duna": 22.0 },
            { datetime: "2025-10-15 15:40", "Estação Duna": 22.3 },
            { datetime: "2025-10-15 15:55", "Estação Duna": 22.4 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Duna": 22.3 },
            { datetime: "2025-10-15 16:25", "Estação Duna": 22.0 },
            { datetime: "2025-10-15 16:40", "Estação Duna": 21.8 },
            { datetime: "2025-10-15 16:55", "Estação Duna": 21.4 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Duna": 21.1 },
            { datetime: "2025-10-15 17:20", "Estação Duna": 20.9 },
            { datetime: "2025-10-15 17:35", "Estação Duna": 20.6 },
            { datetime: "2025-10-15 17:50", "Estação Duna": 20.3 },

            // Estação Éter
            // 13h
            { datetime: "2025-10-15 13:06", "Estação Éter": 21.0 },
            { datetime: "2025-10-15 13:21", "Estação Éter": 21.3 },
            { datetime: "2025-10-15 13:36", "Estação Éter": 21.6 },
            { datetime: "2025-10-15 13:51", "Estação Éter": 21.9 },
            // 14h
            { datetime: "2025-10-15 14:08", "Estação Éter": 22.3 },
            { datetime: "2025-10-15 14:23", "Estação Éter": 22.7 },
            { datetime: "2025-10-15 14:38", "Estação Éter": 23.1 },
            { datetime: "2025-10-15 14:53", "Estação Éter": 23.5 },
            // 15h
            { datetime: "2025-10-15 15:08", "Estação Éter": 23.8 },
            { datetime: "2025-10-15 15:23", "Estação Éter": 24.1 },
            { datetime: "2025-10-15 15:38", "Estação Éter": 24.3 },
            { datetime: "2025-10-15 15:53", "Estação Éter": 24.2 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Éter": 24.0 },
            { datetime: "2025-10-15 16:25", "Estação Éter": 23.7 },
            { datetime: "2025-10-15 16:40", "Estação Éter": 23.4 },
            { datetime: "2025-10-15 16:55", "Estação Éter": 23.0 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Éter": 22.6 },
            { datetime: "2025-10-15 17:20", "Estação Éter": 22.3 },
            { datetime: "2025-10-15 17:35", "Estação Éter": 21.9 },
            { datetime: "2025-10-15 17:50", "Estação Éter": 21.5 },

            // Estação Fênix
            // 13h
            { datetime: "2025-10-15 13:03", "Estação Fênix": 22.0 },
            { datetime: "2025-10-15 13:18", "Estação Fênix": 22.4 },
            { datetime: "2025-10-15 13:33", "Estação Fênix": 22.7 },
            { datetime: "2025-10-15 13:48", "Estação Fênix": 23.0 },
            // 14h
            { datetime: "2025-10-15 14:10", "Estação Fênix": 23.4 },
            { datetime: "2025-10-15 14:25", "Estação Fênix": 23.7 },
            { datetime: "2025-10-15 14:40", "Estação Fênix": 24.0 },
            { datetime: "2025-10-15 14:55", "Estação Fênix": 24.3 },
            // 15h
            { datetime: "2025-10-15 15:05", "Estação Fênix": 24.5 },
            { datetime: "2025-10-15 15:20", "Estação Fênix": 24.7 },
            { datetime: "2025-10-15 15:35", "Estação Fênix": 24.9 },
            { datetime: "2025-10-15 15:50", "Estação Fênix": 25.0 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Fênix": 24.7 },
            { datetime: "2025-10-15 16:25", "Estação Fênix": 24.4 },
            { datetime: "2025-10-15 16:40", "Estação Fênix": 24.0 },
            { datetime: "2025-10-15 16:55", "Estação Fênix": 23.7 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Fênix": 23.3 },
            { datetime: "2025-10-15 17:20", "Estação Fênix": 22.9 },
            { datetime: "2025-10-15 17:35", "Estação Fênix": 22.5 },
            { datetime: "2025-10-15 17:50", "Estação Fênix": 22.2 },

            // Estação Gelo
            // 13h
            { datetime: "2025-10-15 13:07", "Estação Gelo": 18.3 },
            { datetime: "2025-10-15 13:22", "Estação Gelo": 18.5 },
            { datetime: "2025-10-15 13:37", "Estação Gelo": 18.8 },
            { datetime: "2025-10-15 13:52", "Estação Gelo": 19.0 },
            // 14h
            { datetime: "2025-10-15 14:08", "Estação Gelo": 19.3 },
            { datetime: "2025-10-15 14:23", "Estação Gelo": 19.6 },
            { datetime: "2025-10-15 14:38", "Estação Gelo": 19.8 },
            { datetime: "2025-10-15 14:53", "Estação Gelo": 20.0 },
            // 15h
            { datetime: "2025-10-15 15:08", "Estação Gelo": 20.2 },
            { datetime: "2025-10-15 15:23", "Estação Gelo": 20.4 },
            { datetime: "2025-10-15 15:38", "Estação Gelo": 20.6 },
            { datetime: "2025-10-15 15:53", "Estação Gelo": 20.8 },
            // 16h
            { datetime: "2025-10-15 16:08", "Estação Gelo": 20.6 },
            { datetime: "2025-10-15 16:23", "Estação Gelo": 20.3 },
            { datetime: "2025-10-15 16:38", "Estação Gelo": 20.0 },
            { datetime: "2025-10-15 16:53", "Estação Gelo": 19.6 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Gelo": 19.3 },
            { datetime: "2025-10-15 17:20", "Estação Gelo": 19.0 },
            { datetime: "2025-10-15 17:35", "Estação Gelo": 18.8 },
            { datetime: "2025-10-15 17:50", "Estação Gelo": 18.5 },

        ],
    },
    {
        tipo_parametro: "Radiação UV (UVI)",
        estacoes: [
            "Estação Aurora",
            "Estação Boreal",
            "Estação Cobalto",
            "Estação Duna",
            "Estação Éter",
            "Estação Fênix",
            "Estação Gelo",
        ],
        dados: [

            // Estação Aurora
            // 13h
            { datetime: "2025-10-15 13:05", "Estação Aurora": 3.1 },
            { datetime: "2025-10-15 13:20", "Estação Aurora": 3.3 },
            { datetime: "2025-10-15 13:35", "Estação Aurora": 3.5 },
            { datetime: "2025-10-15 13:50", "Estação Aurora": 3.7 },
            // 14h
            { datetime: "2025-10-15 14:10", "Estação Aurora": 4.0 },
            { datetime: "2025-10-15 14:25", "Estação Aurora": 4.2 },
            { datetime: "2025-10-15 14:40", "Estação Aurora": 4.5 },
            { datetime: "2025-10-15 14:55", "Estação Aurora": 4.6 },
            // 15h
            { datetime: "2025-10-15 15:05", "Estação Aurora": 4.8 },
            { datetime: "2025-10-15 15:20", "Estação Aurora": 5.0 },
            { datetime: "2025-10-15 15:35", "Estação Aurora": 5.2 },
            { datetime: "2025-10-15 15:50", "Estação Aurora": 5.3 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Aurora": 5.2 },
            { datetime: "2025-10-15 16:25", "Estação Aurora": 5.0 },
            { datetime: "2025-10-15 16:40", "Estação Aurora": 4.8 },
            { datetime: "2025-10-15 16:55", "Estação Aurora": 4.6 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Aurora": 4.3 },
            { datetime: "2025-10-15 17:20", "Estação Aurora": 4.1 },
            { datetime: "2025-10-15 17:35", "Estação Aurora": 3.8 },
            { datetime: "2025-10-15 17:50", "Estação Aurora": 3.6 },

            // Estação Boreal
            // 13h
            { datetime: "2025-10-15 13:08", "Estação Boreal": 2.9 },
            { datetime: "2025-10-15 13:22", "Estação Boreal": 3.0 },
            { datetime: "2025-10-15 13:38", "Estação Boreal": 3.2 },
            { datetime: "2025-10-15 13:53", "Estação Boreal": 3.4 },
            // 14h
            { datetime: "2025-10-15 14:05", "Estação Boreal": 3.7 },
            { datetime: "2025-10-15 14:20", "Estação Boreal": 3.9 },
            { datetime: "2025-10-15 14:35", "Estação Boreal": 4.1 },
            { datetime: "2025-10-15 14:50", "Estação Boreal": 4.3 },
            // 15h
            { datetime: "2025-10-15 15:05", "Estação Boreal": 4.5 },
            { datetime: "2025-10-15 15:20", "Estação Boreal": 4.7 },
            { datetime: "2025-10-15 15:35", "Estação Boreal": 4.9 },
            { datetime: "2025-10-15 15:50", "Estação Boreal": 5.0 },
            // 16h
            { datetime: "2025-10-15 16:05", "Estação Boreal": 4.9 },
            { datetime: "2025-10-15 16:20", "Estação Boreal": 4.7 },
            { datetime: "2025-10-15 16:35", "Estação Boreal": 4.5 },
            { datetime: "2025-10-15 16:50", "Estação Boreal": 4.3 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Boreal": 4.0 },
            { datetime: "2025-10-15 17:20", "Estação Boreal": 3.8 },
            { datetime: "2025-10-15 17:35", "Estação Boreal": 3.6 },
            { datetime: "2025-10-15 17:50", "Estação Boreal": 3.4 },

            // Estação Cobalto
            // 13h
            { datetime: "2025-10-15 13:10", "Estação Cobalto": 3.2 },
            { datetime: "2025-10-15 13:25", "Estação Cobalto": 3.3 },
            { datetime: "2025-10-15 13:40", "Estação Cobalto": 3.5 },
            { datetime: "2025-10-15 13:55", "Estação Cobalto": 3.6 },
            // 14h
            { datetime: "2025-10-15 14:10", "Estação Cobalto": 3.8 },
            { datetime: "2025-10-15 14:25", "Estação Cobalto": 4.0 },
            { datetime: "2025-10-15 14:40", "Estação Cobalto": 4.2 },
            { datetime: "2025-10-15 14:55", "Estação Cobalto": 4.3 },
            // 15h
            { datetime: "2025-10-15 15:10", "Estação Cobalto": 4.5 },
            { datetime: "2025-10-15 15:25", "Estação Cobalto": 4.7 },
            { datetime: "2025-10-15 15:40", "Estação Cobalto": 4.9 },
            { datetime: "2025-10-15 15:55", "Estação Cobalto": 5.0 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Cobalto": 4.9 },
            { datetime: "2025-10-15 16:25", "Estação Cobalto": 4.7 },
            { datetime: "2025-10-15 16:40", "Estação Cobalto": 4.5 },
            { datetime: "2025-10-15 16:55", "Estação Cobalto": 4.3 },
            // 17h
            { datetime: "2025-10-15 17:10", "Estação Cobalto": 4.0 },
            { datetime: "2025-10-15 17:25", "Estação Cobalto": 3.8 },
            { datetime: "2025-10-15 17:40", "Estação Cobalto": 3.6 },
            { datetime: "2025-10-15 17:55", "Estação Cobalto": 3.4 },

            // Estação Duna
            // 13h
            { datetime: "2025-10-15 13:02", "Estação Duna": 2.8 },
            { datetime: "2025-10-15 13:17", "Estação Duna": 2.9 },
            { datetime: "2025-10-15 13:32", "Estação Duna": 3.1 },
            { datetime: "2025-10-15 13:47", "Estação Duna": 3.2 },
            // 14h
            { datetime: "2025-10-15 14:05", "Estação Duna": 3.4 },
            { datetime: "2025-10-15 14:20", "Estação Duna": 3.5 },
            { datetime: "2025-10-15 14:35", "Estação Duna": 3.7 },
            { datetime: "2025-10-15 14:50", "Estação Duna": 3.8 },
            // 15h
            { datetime: "2025-10-15 15:10", "Estação Duna": 4.0 },
            { datetime: "2025-10-15 15:25", "Estação Duna": 4.2 },
            { datetime: "2025-10-15 15:40", "Estação Duna": 4.3 },
            { datetime: "2025-10-15 15:55", "Estação Duna": 4.5 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Duna": 4.4 },
            { datetime: "2025-10-15 16:25", "Estação Duna": 4.3 },
            { datetime: "2025-10-15 16:40", "Estação Duna": 4.1 },
            { datetime: "2025-10-15 16:55", "Estação Duna": 3.9 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Duna": 3.7 },
            { datetime: "2025-10-15 17:20", "Estação Duna": 3.5 },
            { datetime: "2025-10-15 17:35", "Estação Duna": 3.3 },
            { datetime: "2025-10-15 17:50", "Estação Duna": 3.1 },

            // Estação Éter
            // 13h
            { datetime: "2025-10-15 13:06", "Estação Éter": 3.2 },
            { datetime: "2025-10-15 13:21", "Estação Éter": 3.3 },
            { datetime: "2025-10-15 13:36", "Estação Éter": 3.4 },
            { datetime: "2025-10-15 13:51", "Estação Éter": 3.5 },
            // 14h
            { datetime: "2025-10-15 14:08", "Estação Éter": 3.7 },
            { datetime: "2025-10-15 14:23", "Estação Éter": 3.8 },
            { datetime: "2025-10-15 14:38", "Estação Éter": 4.0 },
            { datetime: "2025-10-15 14:53", "Estação Éter": 4.1 },
            // 15h
            { datetime: "2025-10-15 15:08", "Estação Éter": 4.3 },
            { datetime: "2025-10-15 15:23", "Estação Éter": 4.4 },
            { datetime: "2025-10-15 15:38", "Estação Éter": 4.5 },
            { datetime: "2025-10-15 15:53", "Estação Éter": 4.6 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Éter": 4.7 },
            { datetime: "2025-10-15 16:25", "Estação Éter": 4.8 },
            { datetime: "2025-10-15 16:40", "Estação Éter": 5.0 },
            { datetime: "2025-10-15 16:55", "Estação Éter": 5.1 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Éter": 5.2 },
            { datetime: "2025-10-15 17:20", "Estação Éter": 5.3 },
            { datetime: "2025-10-15 17:35", "Estação Éter": 5.4 },
            { datetime: "2025-10-15 17:50", "Estação Éter": 5.5 },

            // Estação Fênix
            // 13h
            { datetime: "2025-10-15 13:03", "Estação Fênix": 3.3 },
            { datetime: "2025-10-15 13:18", "Estação Fênix": 3.5 },
            { datetime: "2025-10-15 13:33", "Estação Fênix": 3.7 },
            { datetime: "2025-10-15 13:48", "Estação Fênix": 3.9 },
            // 14h
            { datetime: "2025-10-15 14:10", "Estação Fênix": 4.1 },
            { datetime: "2025-10-15 14:25", "Estação Fênix": 4.3 },
            { datetime: "2025-10-15 14:40", "Estação Fênix": 4.5 },
            { datetime: "2025-10-15 14:55", "Estação Fênix": 4.7 },
            // 15h
            { datetime: "2025-10-15 15:05", "Estação Fênix": 4.9 },
            { datetime: "2025-10-15 15:20", "Estação Fênix": 5.1 },
            { datetime: "2025-10-15 15:35", "Estação Fênix": 5.3 },
            { datetime: "2025-10-15 15:50", "Estação Fênix": 5.5 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Fênix": 5.4 },
            { datetime: "2025-10-15 16:25", "Estação Fênix": 5.2 },
            { datetime: "2025-10-15 16:40", "Estação Fênix": 5.0 },
            { datetime: "2025-10-15 16:55", "Estação Fênix": 4.8 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Fênix": 4.6 },
            { datetime: "2025-10-15 17:20", "Estação Fênix": 4.4 },
            { datetime: "2025-10-15 17:35", "Estação Fênix": 4.2 },
            { datetime: "2025-10-15 17:50", "Estação Fênix": 4.0 },

            // Estação Gelo
            // 13h
            { datetime: "2025-10-15 13:07", "Estação Gelo": 2.7 },
            { datetime: "2025-10-15 13:22", "Estação Gelo": 2.8 },
            { datetime: "2025-10-15 13:37", "Estação Gelo": 3.0 },
            { datetime: "2025-10-15 13:52", "Estação Gelo": 3.1 },
            // 14h
            { datetime: "2025-10-15 14:08", "Estação Gelo": 3.3 },
            { datetime: "2025-10-15 14:23", "Estação Gelo": 3.5 },
            { datetime: "2025-10-15 14:38", "Estação Gelo": 3.6 },
            { datetime: "2025-10-15 14:53", "Estação Gelo": 3.8 },
            // 15h
            { datetime: "2025-10-15 15:08", "Estação Gelo": 4.0 },
            { datetime: "2025-10-15 15:23", "Estação Gelo": 4.1 },
            { datetime: "2025-10-15 15:38", "Estação Gelo": 4.3 },
            { datetime: "2025-10-15 15:53", "Estação Gelo": 4.4 },
            // 16h
            { datetime: "2025-10-15 16:08", "Estação Gelo": 4.3 },
            { datetime: "2025-10-15 16:23", "Estação Gelo": 4.1 },
            { datetime: "2025-10-15 16:38", "Estação Gelo": 3.9 },
            { datetime: "2025-10-15 16:53", "Estação Gelo": 3.7 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Gelo": 3.5 },
            { datetime: "2025-10-15 17:20", "Estação Gelo": 3.3 },
            { datetime: "2025-10-15 17:35", "Estação Gelo": 3.1 },
            { datetime: "2025-10-15 17:50", "Estação Gelo": 2.9 },
        ],
    },
    {
        tipo_parametro: "Pressão Absoluta (hPa)",
        estacoes: [
            "Estação Aurora",
            "Estação Boreal",
            "Estação Cobalto",
            "Estação Duna",
            "Estação Éter",
            "Estação Fênix",
            "Estação Gelo",
        ],
        dados: [

            // Estação Aurora
            // 13h
            { datetime: "2025-10-15 13:05", "Estação Aurora": 1012.1 },
            { datetime: "2025-10-15 13:20", "Estação Aurora": 1012.3 },
            { datetime: "2025-10-15 13:35", "Estação Aurora": 1012.5 },
            { datetime: "2025-10-15 13:50", "Estação Aurora": 1012.7 },
            // 14h
            { datetime: "2025-10-15 14:10", "Estação Aurora": 1013.0 },
            { datetime: "2025-10-15 14:25", "Estação Aurora": 1013.2 },
            { datetime: "2025-10-15 14:40", "Estação Aurora": 1013.4 },
            { datetime: "2025-10-15 14:55", "Estação Aurora": 1013.6 },
            // 15h
            { datetime: "2025-10-15 15:05", "Estação Aurora": 1013.8 },
            { datetime: "2025-10-15 15:20", "Estação Aurora": 1014.0 },
            { datetime: "2025-10-15 15:35", "Estação Aurora": 1014.2 },
            { datetime: "2025-10-15 15:50", "Estação Aurora": 1014.4 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Aurora": 1014.3 },
            { datetime: "2025-10-15 16:25", "Estação Aurora": 1014.1 },
            { datetime: "2025-10-15 16:40", "Estação Aurora": 1013.9 },
            { datetime: "2025-10-15 16:55", "Estação Aurora": 1013.7 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Aurora": 1013.5 },
            { datetime: "2025-10-15 17:20", "Estação Aurora": 1013.3 },
            { datetime: "2025-10-15 17:35", "Estação Aurora": 1013.1 },
            { datetime: "2025-10-15 17:50", "Estação Aurora": 1012.9 },

            // Estação Boreal
            // 13h
            { datetime: "2025-10-15 13:08", "Estação Boreal": 1012.0 },
            { datetime: "2025-10-15 13:22", "Estação Boreal": 1012.2 },
            { datetime: "2025-10-15 13:38", "Estação Boreal": 1012.4 },
            { datetime: "2025-10-15 13:53", "Estação Boreal": 1012.6 },
            // 14h
            { datetime: "2025-10-15 14:05", "Estação Boreal": 1012.8 },
            { datetime: "2025-10-15 14:20", "Estação Boreal": 1013.0 },
            { datetime: "2025-10-15 14:35", "Estação Boreal": 1013.2 },
            { datetime: "2025-10-15 14:50", "Estação Boreal": 1013.4 },
            // 15h
            { datetime: "2025-10-15 15:05", "Estação Boreal": 1013.6 },
            { datetime: "2025-10-15 15:20", "Estação Boreal": 1013.8 },
            { datetime: "2025-10-15 15:35", "Estação Boreal": 1014.0 },
            { datetime: "2025-10-15 15:50", "Estação Boreal": 1014.2 },
            // 16h
            { datetime: "2025-10-15 16:05", "Estação Boreal": 1014.1 },
            { datetime: "2025-10-15 16:20", "Estação Boreal": 1013.9 },
            { datetime: "2025-10-15 16:35", "Estação Boreal": 1013.7 },
            { datetime: "2025-10-15 16:50", "Estação Boreal": 1013.5 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Boreal": 1013.3 },
            { datetime: "2025-10-15 17:20", "Estação Boreal": 1013.1 },
            { datetime: "2025-10-15 17:35", "Estação Boreal": 1012.9 },
            { datetime: "2025-10-15 17:50", "Estação Boreal": 1012.7 },

            // Estação Cobalto
            // 13h
            { datetime: "2025-10-15 13:10", "Estação Cobalto": 1012.2 },
            { datetime: "2025-10-15 13:25", "Estação Cobalto": 1012.4 },
            { datetime: "2025-10-15 13:40", "Estação Cobalto": 1012.6 },
            { datetime: "2025-10-15 13:55", "Estação Cobalto": 1012.8 },
            // 14h
            { datetime: "2025-10-15 14:10", "Estação Cobalto": 1013.0 },
            { datetime: "2025-10-15 14:25", "Estação Cobalto": 1013.2 },
            { datetime: "2025-10-15 14:40", "Estação Cobalto": 1013.4 },
            { datetime: "2025-10-15 14:55", "Estação Cobalto": 1013.6 },
            // 15h
            { datetime: "2025-10-15 15:10", "Estação Cobalto": 1013.8 },
            { datetime: "2025-10-15 15:25", "Estação Cobalto": 1014.0 },
            { datetime: "2025-10-15 15:40", "Estação Cobalto": 1014.2 },
            { datetime: "2025-10-15 15:55", "Estação Cobalto": 1014.4 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Cobalto": 1014.3 },
            { datetime: "2025-10-15 16:25", "Estação Cobalto": 1014.1 },
            { datetime: "2025-10-15 16:40", "Estação Cobalto": 1013.9 },
            { datetime: "2025-10-15 16:55", "Estação Cobalto": 1013.7 },
            // 17h
            { datetime: "2025-10-15 17:10", "Estação Cobalto": 1013.5 },
            { datetime: "2025-10-15 17:25", "Estação Cobalto": 1013.3 },
            { datetime: "2025-10-15 17:40", "Estação Cobalto": 1013.1 },
            { datetime: "2025-10-15 17:55", "Estação Cobalto": 1012.9 },

            // Estação Duna
            // 13h
            { datetime: "2025-10-15 13:02", "Estação Duna": 1011.8 },
            { datetime: "2025-10-15 13:17", "Estação Duna": 1012.0 },
            { datetime: "2025-10-15 13:32", "Estação Duna": 1012.2 },
            { datetime: "2025-10-15 13:47", "Estação Duna": 1012.4 },
            // 14h
            { datetime: "2025-10-15 14:05", "Estação Duna": 1012.6 },
            { datetime: "2025-10-15 14:20", "Estação Duna": 1012.8 },
            { datetime: "2025-10-15 14:35", "Estação Duna": 1013.0 },
            { datetime: "2025-10-15 14:50", "Estação Duna": 1013.2 },
            // 15h
            { datetime: "2025-10-15 15:10", "Estação Duna": 1013.4 },
            { datetime: "2025-10-15 15:25", "Estação Duna": 1013.6 },
            { datetime: "2025-10-15 15:40", "Estação Duna": 1013.8 },
            { datetime: "2025-10-15 15:55", "Estação Duna": 1014.0 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Duna": 1013.9 },
            { datetime: "2025-10-15 16:25", "Estação Duna": 1013.7 },
            { datetime: "2025-10-15 16:40", "Estação Duna": 1013.5 },
            { datetime: "2025-10-15 16:55", "Estação Duna": 1013.3 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Duna": 1013.1 },
            { datetime: "2025-10-15 17:20", "Estação Duna": 1012.9 },
            { datetime: "2025-10-15 17:35", "Estação Duna": 1012.7 },
            { datetime: "2025-10-15 17:50", "Estação Duna": 1012.5 },

            // Estação Éter
            // 13h
            { datetime: "2025-10-15 13:06", "Estação Éter": 1012.3 },
            { datetime: "2025-10-15 13:21", "Estação Éter": 1012.5 },
            { datetime: "2025-10-15 13:36", "Estação Éter": 1012.7 },
            { datetime: "2025-10-15 13:51", "Estação Éter": 1012.9 },
            // 14h
            { datetime: "2025-10-15 14:08", "Estação Éter": 1013.1 },
            { datetime: "2025-10-15 14:23", "Estação Éter": 1013.3 },
            { datetime: "2025-10-15 14:38", "Estação Éter": 1013.5 },
            { datetime: "2025-10-15 14:53", "Estação Éter": 1013.7 },
            // 15h
            { datetime: "2025-10-15 15:08", "Estação Éter": 1013.9 },
            { datetime: "2025-10-15 15:23", "Estação Éter": 1014.1 },
            { datetime: "2025-10-15 15:38", "Estação Éter": 1014.3 },
            { datetime: "2025-10-15 15:53", "Estação Éter": 1014.5 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Éter": 1014.4 },
            { datetime: "2025-10-15 16:25", "Estação Éter": 1014.2 },
            { datetime: "2025-10-15 16:40", "Estação Éter": 1014.0 },
            { datetime: "2025-10-15 16:55", "Estação Éter": 1013.8 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Éter": 1013.6 },
            { datetime: "2025-10-15 17:20", "Estação Éter": 1013.4 },
            { datetime: "2025-10-15 17:35", "Estação Éter": 1013.2 },
            { datetime: "2025-10-15 17:50", "Estação Éter": 1013.0 },

            // Estação Fênix
            // 13h
            { datetime: "2025-10-15 13:03", "Estação Fênix": 1012.4 },
            { datetime: "2025-10-15 13:18", "Estação Fênix": 1012.6 },
            { datetime: "2025-10-15 13:33", "Estação Fênix": 1012.8 },
            { datetime: "2025-10-15 13:48", "Estação Fênix": 1013.0 },
            // 14h
            { datetime: "2025-10-15 14:10", "Estação Fênix": 1013.2 },
            { datetime: "2025-10-15 14:25", "Estação Fênix": 1013.4 },
            { datetime: "2025-10-15 14:40", "Estação Fênix": 1013.6 },
            { datetime: "2025-10-15 14:55", "Estação Fênix": 1013.8 },
            // 15h
            { datetime: "2025-10-15 15:05", "Estação Fênix": 1014.0 },
            { datetime: "2025-10-15 15:20", "Estação Fênix": 1014.2 },
            { datetime: "2025-10-15 15:35", "Estação Fênix": 1014.4 },
            { datetime: "2025-10-15 15:50", "Estação Fênix": 1014.6 },
            // 16h
            { datetime: "2025-10-15 16:10", "Estação Fênix": 1014.5 },
            { datetime: "2025-10-15 16:25", "Estação Fênix": 1014.3 },
            { datetime: "2025-10-15 16:40", "Estação Fênix": 1014.1 },
            { datetime: "2025-10-15 16:55", "Estação Fênix": 1013.9 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Fênix": 1013.7 },
            { datetime: "2025-10-15 17:20", "Estação Fênix": 1013.5 },
            { datetime: "2025-10-15 17:35", "Estação Fênix": 1013.3 },
            { datetime: "2025-10-15 17:50", "Estação Fênix": 1013.1 },

            // Estação Gelo
            // 13h
            { datetime: "2025-10-15 13:07", "Estação Gelo": 1011.9 },
            { datetime: "2025-10-15 13:22", "Estação Gelo": 1012.1 },
            { datetime: "2025-10-15 13:37", "Estação Gelo": 1012.3 },
            { datetime: "2025-10-15 13:52", "Estação Gelo": 1012.5 },
            // 14h
            { datetime: "2025-10-15 14:08", "Estação Gelo": 1012.7 },
            { datetime: "2025-10-15 14:23", "Estação Gelo": 1012.9 },
            { datetime: "2025-10-15 14:38", "Estação Gelo": 1013.1 },
            { datetime: "2025-10-15 14:53", "Estação Gelo": 1013.3 },
            // 15h
            { datetime: "2025-10-15 15:08", "Estação Gelo": 1013.5 },
            { datetime: "2025-10-15 15:23", "Estação Gelo": 1013.7 },
            { datetime: "2025-10-15 15:38", "Estação Gelo": 1013.9 },
            { datetime: "2025-10-15 15:53", "Estação Gelo": 1014.1 },
            // 16h
            { datetime: "2025-10-15 16:08", "Estação Gelo": 1014.0 },
            { datetime: "2025-10-15 16:23", "Estação Gelo": 1013.8 },
            { datetime: "2025-10-15 16:38", "Estação Gelo": 1013.6 },
            { datetime: "2025-10-15 16:53", "Estação Gelo": 1013.4 },
            // 17h
            { datetime: "2025-10-15 17:05", "Estação Gelo": 1013.2 },
            { datetime: "2025-10-15 17:20", "Estação Gelo": 1013.0 },
            { datetime: "2025-10-15 17:35", "Estação Gelo": 1012.8 },
            { datetime: "2025-10-15 17:50", "Estação Gelo": 1012.6 },
        ],
    },
];

export default mockParametros;
