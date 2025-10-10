"use client"

import AreaChartComponent from "./components/AreaChart";

// Dados mockados para teste
const temperatureData = [
  { time: "8h", "Estação Antônio Saes": 12, "Estação José de Elencar": 11, "Estação Shopping Cent": 13, "Estação Praça Campos": 10, tipo_parametro: "Temperatura" },
  { time: "9h", "Estação Antônio Saes": 13, "Estação José de Elencar": 12, "Estação Shopping Cent": 14, "Estação Praça Campos": 11, tipo_parametro: "Temperatura" },
  { time: "10h", "Estação Antônio Saes": 14, "Estação José de Elencar": 13, "Estação Shopping Cent": 15, "Estação Praça Campos": 12, tipo_parametro: "Temperatura" },
  { time: "11h", "Estação Antônio Saes": 15, "Estação José de Elencar": 14, "Estação Shopping Cent": 16, "Estação Praça Campos": 13, tipo_parametro: "Temperatura" },
  { time: "12h", "Estação Antônio Saes": 16, "Estação José de Elencar": 15, "Estação Shopping Cent": 17, "Estação Praça Campos": 14, tipo_parametro: "Temperatura" },
];

const uvRadiationData = [
  { time: "8h", "Estação Antônio Saes": 3, "Estação José de Elencar": 4, "Estação Shopping Cent": 5, "Estação Praça Campos": 2, tipo_parametro: "Radiação UV" },
  { time: "9h", "Estação Antônio Saes": 4, "Estação José de Elencar": 5, "Estação Shopping Cent": 6, "Estação Praça Campos": 3, tipo_parametro: "Radiação UV" },
  { time: "10h", "Estação Antônio Saes": 5, "Estação José de Elencar": 6, "Estação Shopping Cent": 7, "Estação Praça Campos": 4, tipo_parametro: "Radiação UV" },
  { time: "11h", "Estação Antônio Saes": 6, "Estação José de Elencar": 7, "Estação Shopping Cent": 8, "Estação Praça Campos": 5, tipo_parametro: "Radiação UV" },
  { time: "12h", "Estação Antônio Saes": 7, "Estação José de Elencar": 8, "Estação Shopping Cent": 9, "Estação Praça Campos": 6, tipo_parametro: "Radiação UV" },
];

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      <AreaChartComponent 
        data={temperatureData} 
        stations={["Estação Antônio Saes", "Estação José de Elencar", "Estação Shopping Cent", "Estação Praça Campos"]} 
        title={temperatureData[0]?.tipo_parametro} // Usando tipo_parametro do primeiro item dos dados
      />
      <AreaChartComponent 
        data={uvRadiationData} 
        stations={["Estação Antônio Saes", "Estação José de Elencar", "Estação Shopping Cent", "Estação Praça Campos"]} 
        title={uvRadiationData[0]?.tipo_parametro} // Usando tipo_parametro do primeiro item dos dados
      />
    </div>
  );
};

export default Dashboard;
