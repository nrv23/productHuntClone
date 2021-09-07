import React from 'react'
import DetallesProducto from '../components/layout/DetallesProducto';
import Layout from '../components/layout/Layout';
import useProductos from '../hooks/useProductos';


const Home = () => {

  const {productos} = useProductos('creador');
  


  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {
                productos.map(producto => (
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
  )
}

export default Home