import { useRouter } from 'next/router';
import React,{useEffect,useState} from 'react'
import Layout from '../components/layout/Layout';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

const Buscar = () => {

  const router = useRouter();
  const {query:{q}} = router;
  const {productos} = useProductos('creador');
  const [resultado, guardarResultado] = useState([]);

  useEffect(() => {
    
    const busqueda = q.toString().toLowerCase();
    const filtro = productos.filter(producto => producto.nombre.toLowerCase().includes(busqueda) || producto.descripcion.toLowerCase().includes(busqueda));
    //filtrar productos que contengan la variable busqueda en su nombre de producto
    guardarResultado(filtro)
    
  }, [q,productos])



  return  <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {
                resultado.map(producto => (
                  <DetallesProducto 
                      key={producto.id} 
                      producto={producto} 
                    />
                  ))
              }
            </ul>
          </div>
        </div>
      </Layout>
    </div>
}

export default Buscar