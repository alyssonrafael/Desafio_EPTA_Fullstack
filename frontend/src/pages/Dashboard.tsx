import { FaPlus } from "react-icons/fa";
import Button from "../components/Button";

const Dashboard = () => {
    return (
        <div className="text-center font-bold text-4xl min-h-screen flex items-center flex-col justify-center">
        <h1 className="text-textoPrimario text-7xl  ">Pagina de dashboard</h1>
        <h1 className="text-textoPrimario  ">Hello, world</h1>
        <h1 className="text-textoSecundario">Hello, world</h1>
        <h1 className="text-numCard">Hello, world</h1>
        <h1 className="text-textoCard">Hello, world</h1>
        <h1 className="text-textoSecundario">Hello, world</h1>
        <h1 className="text-textoInativo">Hello, world</h1>
        <Button
          label="Meu teste de botao padrão"
          classNameButton="mt-5"
          classNameText="text-2xl"
          type="button"
          onClick={() => {
            alert("fui precionado");
          }}
          icon={<FaPlus className="text-sm" />}
          iconPosition="left"
        />
      </div>
    );
  };
  
  export default Dashboard;
  